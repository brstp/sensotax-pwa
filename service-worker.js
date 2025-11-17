// ÄNDRA DETTA VÄRDE VID VARJE UPPDATERING AV TAXONOMIN!
// Vi höjer versionen här, t.ex. till v3.
const CACHE_NAME = 'oltaxonomi-cache-v3'; 

const urlsToCache = [
  // Roten tas bort. Vi cache:ar endast faktiska filer:
  '/sensotax-pwa/sensotax.html',
  '/sensotax-pwa/manifest.webmanifest',
  '/sensotax-pwa/service-worker.js',
  '/sensotax-pwa/index.html', // index.html är viktigt för omdirigeringen
  '/sensotax-pwa/ikon/icon-192.png', 
  '/sensotax-pwa/ikon/icon-512.png'
];

// ... resten av koden för install, activate och fetch är bra
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
