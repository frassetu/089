const CACHE_NAME='astreinte-cache-v1';
const FILES_TO_CACHE=[
  './','./index.html','./actions.html','./synthese.html','./interventions.html',
  './src/style.css','./src/theme.css','./src/app.js','./src/actions.js','./src/ui.js','./src/menu.js','./src/router.js','./src/time.js','./src/interventions.js','./src/engine.js','./src/storage.js','./src/feries.js',
  './manifest.json','./assets/icon-192.png','./assets/icon-512.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES_TO_CACHE))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
