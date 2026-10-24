const CACHE='hanmaeum2026-v7-worship-20261024';
const ASSETS=['./','./index.html','./poster.jpg','./layout.png','./table.jpg','./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('hanmaeum2026-') && key !== CACHE).map(key => caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
 if (event.request.method !== 'GET') return;
 const url=new URL(event.request.url);
 if (url.origin !== self.location.origin) return;
 if (event.request.mode==='navigate') {
  event.respondWith(fetch(event.request).then(res=>{if(res.ok){const saved=res.clone();caches.open(CACHE).then(c=>c.put(event.request,saved));}return res;}).catch(()=>caches.match(event.request).then(c=>c || caches.match('./index.html'))));
 } else {
  event.respondWith(caches.match(event.request).then(c=>c || fetch(event.request).then(res=>{if(res.ok){const saved=res.clone();caches.open(CACHE).then(cache=>cache.put(event.request,saved));}return res;})));
 }
});
