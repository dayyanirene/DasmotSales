// Only public application assets are cached. Firebase API responses are never cached here.
const PREFIX='dasmot-v2-shell-'+new URL(self.registration.scope).pathname;
const CACHE=PREFIX+'-single-html-20260914-1';
const SDK='https://www.gstatic.com/firebasejs/12.18.0/';
const local=['./','index.html','favicon.svg','manifest.webmanifest'];
const assets=local.map(x=>new URL(x,self.registration.scope).href).concat(['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(x=>SDK+x));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(assets)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET')return;const shellNavigation=event.request.mode==='navigate'&&url.origin===self.location.origin&&(url.pathname===new URL(self.registration.scope).pathname||url.pathname===new URL('index.html',self.registration.scope).pathname);if(!shellNavigation&&!assets.includes(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const key=shellNavigation?new URL('index.html',self.registration.scope).href:url.href;const saved=await cache.match(key);if(saved)return saved;return fetch(event.request);})());});
