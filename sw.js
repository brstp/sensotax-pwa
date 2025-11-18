// Change the cache name when updating files to force service worker to install new assets
const CACHE_NAME = 'sensotax-cache-v11'; 
const urlsToCache = [
  './',
  'sensotax.html',
  
  // CORRECTED: Manifest file name updated to standard 'manifest.json'
  'manifest.json',
  
  // NEW: Add data file
  'taxonomy.yaml',
  
  // NEW: Add the js-yaml library for offline parsing
  'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js',
  
  // CORRECTED: Icon paths updated to 'images/' directory
  'images/icon-192.png',
  'images/icon-512.png'
  // Add any other static CSS or JS files here
];

// Installation: Cache assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache required assets:', err);
      })
  );
});

// Activation: Clean up old caches (for updates)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Cleaning up old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Important: Ensure the service worker takes control over clients immediately
  return self.clients.claim(); 
});

// Fetch: Serve from cache first, then fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if found
        if (response) {
          return response;
        }
        // Otherwise, fetch from the network
        return fetch(event.request);
      })
    );
});