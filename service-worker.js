// Öka till v15 (Final fix attempt)
const CACHE_NAME = 'oltaxonomi-cache-v15'; 

const urlsToCache = [
  './', 
  'sensotax.html',
  'manifest.webmanifest',
  // OBS: Vi använder nu absoluta sökvägar för ikonerna i cachen.
  '/sensotax-pwa/icon-192.png', 
  '/sensotax-pwa/icon-512.png'
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
            console.log('Rensar gammal cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Viktigt: Se till att service workern tar kontroll över klienterna omedelbart
  return self.clients.claim(); 
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
