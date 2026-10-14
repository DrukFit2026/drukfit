// Web Push for DrukFit (RFC 8030 delivery, RFC 8291 aes128gcm encryption, RFC 8292 VAPID).
// Node built-ins only: no packages to install, nothing to keep updated.
'use strict';
const crypto = require('crypto');

const b64u = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');

/** Create a VAPID key pair (raw base64url, as browsers expect). */
function generateVapidKeys(){
  const ecdh = crypto.createECDH('prime256v1'); ecdh.generateKeys();
  return { publicKey: b64u(ecdh.getPublicKey()), privateKey: b64u(ecdh.getPrivateKey()) };
}
function vapidKeyObject(publicKey, privateKey){
  const pub = unb64u(publicKey); if (pub.length !== 65 || pub[0] !== 4) throw new Error('VAPID public key must be an uncompressed P-256 point');
  return crypto.createPrivateKey({ key: { kty:'EC', crv:'P-256', x: b64u(pub.subarray(1, 33)), y: b64u(pub.subarray(33)), d: privateKey }, format:'jwk' });
}
/** Signed VAPID token for one push service origin. */
function vapidToken(endpoint, subject, publicKey, privateKey, nowSec){
  const aud = new URL(endpoint).origin; const exp = (nowSec || Math.floor(Date.now() / 1000)) + 12 * 3600;
  const head = b64u(JSON.stringify({ typ:'JWT', alg:'ES256' })), body = b64u(JSON.stringify({ aud, exp, sub: subject }));
  const sig = crypto.sign('sha256', Buffer.from(head + '.' + body), { key: vapidKeyObject(publicKey, privateKey), dsaEncoding:'ieee-p1363' });
  return head + '.' + body + '.' + b64u(sig);
}
/** Encrypt a payload for one subscription (aes128gcm, single record). */
function encrypt(payload, p256dh, authSecret, opts){
  opts = opts || {};
  const uaPublic = unb64u(p256dh), auth = unb64u(authSecret);
  const ecdh = crypto.createECDH('prime256v1'); if (opts.asPrivate) ecdh.setPrivateKey(opts.asPrivate); else ecdh.generateKeys();
  const asPublic = ecdh.getPublicKey(); const shared = ecdh.computeSecret(uaPublic);
  const salt = opts.salt || crypto.randomBytes(16);
  const ikm = Buffer.from(crypto.hkdfSync('sha256', shared, auth, Buffer.concat([Buffer.from('WebPush: info\0'), uaPublic, asPublic]), 32));
  const cek = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
  const plain = Buffer.concat([Buffer.from(payload), Buffer.from([2])]); // 0x02 = last (and only) record
  if (plain.length + 16 > 4096 - 86) throw new Error('payload too large');
  const c = crypto.createCipheriv('aes-128-gcm', cek, nonce); const body = Buffer.concat([c.update(plain), c.final(), c.getAuthTag()]);
  const rs = Buffer.alloc(4); rs.writeUInt32BE(4096);
  return Buffer.concat([salt, rs, Buffer.from([asPublic.length]), asPublic, body]);
}
/** Receiver side (used by tests to prove the encryption is correct). */
function decrypt(buf, uaPrivate, uaPublicB64, authSecret){
  const salt = buf.subarray(0, 16); const idlen = buf[20]; const asPublic = buf.subarray(21, 21 + idlen); const ct = buf.subarray(21 + idlen);
  const ecdh = crypto.createECDH('prime256v1'); ecdh.setPrivateKey(uaPrivate); const shared = ecdh.computeSecret(asPublic);
  const uaPublic = unb64u(uaPublicB64);
  const ikm = Buffer.from(crypto.hkdfSync('sha256', shared, unb64u(authSecret), Buffer.concat([Buffer.from('WebPush: info\0'), uaPublic, asPublic]), 32));
  const cek = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
  const d = crypto.createDecipheriv('aes-128-gcm', cek, nonce); d.setAuthTag(ct.subarray(ct.length - 16));
  const out = Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]);
  let end = out.length - 1; while (end >= 0 && out[end] === 0) end--; // strip padding
  if (out[end] !== 2) throw new Error('bad record delimiter');
  return out.subarray(0, end).toString();
}
/**
 * Send one notification. Returns { ok, gone, status }.
 * gone = the phone has unsubscribed (404/410), so the subscription should be deleted.
 */
async function send(sub, payload, vapid, fetchImpl){
  const f = fetchImpl || fetch;
  const body = encrypt(JSON.stringify(payload), sub.p256dh, sub.auth);
  const jwt = vapidToken(sub.endpoint, vapid.subject, vapid.publicKey, vapid.privateKey);
  const res = await f(sub.endpoint, { method:'POST', body, headers: {
    'Content-Encoding':'aes128gcm', 'Content-Type':'application/octet-stream', TTL: String(payload.ttl || 4 * 3600), Urgency:'normal',
    Topic: String(payload.tag || 'drukfit').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || 'drukfit',
    Authorization: `vapid t=${jwt}, k=${vapid.publicKey}` } });
  return { ok: res.status >= 200 && res.status < 300, gone: res.status === 404 || res.status === 410, status: res.status };
}
module.exports = { generateVapidKeys, vapidToken, encrypt, decrypt, send, b64u, unb64u };
