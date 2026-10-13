const CACHE='rocce-in-tasca-v1.5.0';
const ASSETS=['./maps/lago-piccolo-foto.jpg','./maps/piemonte-geologico.jpg','./maps/avigliana-carg.jpg','./maps/carg-legenda-depositi.jpg','./maps/carg-legenda-substrato.jpg','./','./index.html','./Rocce_in_tasca_v1.5.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./photos/granito.jpg','./photos/granito-rosa.jpg','./photos/granodiorite.jpg','./photos/tonalite.jpg','./photos/sienite.jpg','./photos/diorite.jpg','./photos/gabbro.jpg','./photos/eufotide.jpg','./photos/riolite.jpg','./photos/porfido.jpg','./photos/trachite.jpg','./photos/andesite.jpg','./photos/basalto.jpg','./photos/ossidiana.jpg','./photos/pomice.jpg','./photos/breccia.jpg','./photos/puddinga.jpg','./photos/arenaria.jpg','./photos/argillite.jpg','./photos/marna.jpg','./photos/calcare.jpg','./photos/calcare-fossilifero.jpg','./photos/dolomia.jpg','./photos/travertino.jpg','./photos/selce.jpg','./photos/litantrace.jpg','./photos/antracite.jpg','./photos/marmo.jpg','./photos/gneiss.jpg','./photos/micascisto.jpg','./photos/fillade.jpg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('rocce-in-tasca-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.endsWith('/version.json'))return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(response.ok&&!response.redirected){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
