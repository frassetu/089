/**********************************************************************
 * service-worker.js
 * 
 * Rend la PWA installable + fonctionnelle hors-ligne :
 *   - Cache des fichiers essentiels
 *   - Mode offline
 *   - Mise à jour automatique si nouvelle version
 **********************************************************************/

const CACHE_NAME = "astreinte-cache-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./actions.html",
  "./synthese.html",
  "./interventions.html",

  "./src/style.css",
  "./src/theme.css",
  "./src/app.js",
  "./src/actions.js",
  "./src/ui.js",
  "./src/menu.js",
  "./src/time.js",
  "./src/interventions.js",
  "./src/engine.js",
  "./src/storage.js",
  "./src/feries.js",

  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

/* -----------------------------------------------------------
   INSTALLATION : mise en cache des fichiers
----------------------------------------------------------- */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* -----------------------------------------------------------
   ACTIVATION : nettoyage anciens caches
----------------------------------------------------------- */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(k => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* -----------------------------------------------------------
   FETCH : renvoie fichier depuis cache si offline
----------------------------------------------------------- */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si trouvé dans le cache → on le sert
        if (response) return response;

        // Sinon → on tente le réseau
        return fetch(event.request);
      })
  );
});