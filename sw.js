const CACHE='rocce-in-tasca-v1.2.0';
const ASSETS=['./','./index.html','./Rocce_in_tasca_v1.2.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./photos/granito.jpg','./photos/diorite.jpg','./photos/sienite.jpg','./photos/basalto.jpg','./photos/riolite.jpg','./photos/arenaria.jpg','./photos/puddinga.jpg','./photos/marmo.jpg','./photos/gneiss.jpg','./photos/fillade.jpg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('rocce-in-tasca-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.endsWith('/version.json'))return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(response.ok&&!response.redirected){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
