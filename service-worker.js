const CACHE_NAME = 'oltaxonomi-cache-v1';
const urlsToCache = [
  'oltaxonomi.html',
  'manifest.webmanifest',
  'service-worker.js',
  'icon-192.png',
  'icon-512.png',
  // Lägg till alla andra filer du använder (CSS, bilder etc.)
];

// Installation: Cache:a filer
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivering: Ta bort gammal cache (för uppdateringar)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Hämta: Använd cache:ade filer när det är möjligt
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Returnera cache:ad version om den finns
        if (response) {
          return response;
        }
        // Annars, hämta från nätverket
        return fetch(event.request);
      })
    );
});
