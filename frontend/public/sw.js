// Service worker basique pour PWA
const CACHE_NAME = 'dashboard-mvp-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Récupération des ressources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne la ressource du cache si elle existe, sinon la récupère du réseau
        return response || fetch(event.request);
      })
  );
});