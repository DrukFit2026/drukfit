/* DrukFit service worker: offline-first app shell. Version 5489454e9c */
const CACHE = 'drukfit-5489454e9c';
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/favicon-32.png", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache:'reload' }))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('drukfit-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') { // app shell: cached copy first so it opens instantly offline
    e.respondWith(caches.match('./index.html').then(hit => hit || fetch(req)));
    return;
  }
  if (url.origin === location.origin) { e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }))); return; }
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) { // fonts: cache after first load
    e.respondWith(caches.open(CACHE + '-fonts').then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit))));
  }
});
