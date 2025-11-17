// Öka CACHE_NAME till v17 eller högre!
const CACHE_NAME = 'oltaxonomi-cache-v30';
const urlsToCache = [
  // ... befintliga filer ...
  './', 
  'sensotax.html',
  'manifest.webmanifest',
  
  // NYTT: Lägg till datafilen!
  'taxonomy.yaml',
  
  // ... övriga ikoner ...
  'icon-192.png',
  'icon-512.png'
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
