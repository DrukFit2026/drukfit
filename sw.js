/* DrukFit service worker: offline-first app shell. Version c46b6cc75d */
const CACHE = 'drukfit-c46b6cc75d';
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/favicon-32.png", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache:'reload' }))))); });
const FONTS = 'drukfit-fonts'; // kept across updates so the app's fonts never disappear after an update
async function keepFonts(ks){ // move fonts saved by older versions into the permanent font cache
  const dst = await caches.open(FONTS);
  for (const k of ks.filter(k => /^drukfit-.+-fonts$/.test(k))) { const c = await caches.open(k); for (const r of await c.keys()) { if (!(await dst.match(r))) { const res = await c.match(r); if (res) await dst.put(r, res); } } }
}
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => keepFonts(ks).then(() => Promise.all(ks.filter(k => k.startsWith('drukfit-') && k !== CACHE && k !== FONTS).map(k => caches.delete(k))))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
// Phone notifications from the DrukFit reminder job (payload is encrypted end-to-end by the push service)
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title:'DrukFit', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'DrukFit', { body: d.body || '', icon:'icons/icon-192.png', badge:'icons/icon-192.png', tag: d.tag || 'drukfit', data: { url: d.url || '#dashboard' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = new URL('./' + ((e.notification.data && e.notification.data.url) || ''), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(list => {
    for (const c of list) { if (c.url.startsWith(self.registration.scope)) { c.focus(); return c.navigate ? c.navigate(target) : null; } }
    return self.clients.openWindow(target);
  }));
});
self.addEventListener('pushsubscriptionchange', e => { /* the app re-subscribes and saves the new endpoint next time it opens */ });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') { // app shell: cached copy first so it opens instantly offline
    e.respondWith(caches.match('./index.html').then(hit => hit || fetch(req)));
    return;
  }
  if (url.origin === location.origin && url.pathname.endsWith('/feed.json')) return; // DrukFit Daily feed: always network (the app keeps its own offline copy)
  if (url.origin === location.origin) { e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }))); return; }
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) { // fonts: cache after first load
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit))));
  }
});
