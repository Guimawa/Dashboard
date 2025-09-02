// ------------------------------------------------------------
// SERVICE WORKER AVANCÉ - PWA COMPLÈTE
// Cache stratégique, mode hors ligne, synchronisation
// ------------------------------------------------------------

const CACHE_NAME = 'dashboard-pro-v1.0.0';
const STATIC_CACHE = 'dashboard-static-v1.0.0';
const DYNAMIC_CACHE = 'dashboard-dynamic-v1.0.0';
const API_CACHE = 'dashboard-api-v1.0.0';

// Ressources critiques à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  // Icônes PWA
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Pages principales
  '/dashboard',
  '/table-ronde',
  '/vault',
  '/dashboard-main'
];

// Ressources à mettre en cache dynamiquement
const DYNAMIC_PATTERNS = [
  /^\/static\//,
  /^\/icons\//,
  /^\/screenshots\//,
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/
];

// APIs à mettre en cache
const API_PATTERNS = [
  /^\/api\//,
  /^\/health$/
];

// Configuration du cache
const CACHE_CONFIG = {
  // Cache statique - persistant
  static: {
    name: STATIC_CACHE,
    maxEntries: 50,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
    strategy: 'cacheFirst'
  },
  // Cache dynamique - avec validation
  dynamic: {
    name: DYNAMIC_CACHE,
    maxEntries: 100,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
    strategy: 'staleWhileRevalidate'
  },
  // Cache API - avec réseau en priorité
  api: {
    name: API_CACHE,
    maxEntries: 50,
    maxAgeSeconds: 5 * 60, // 5 minutes
    strategy: 'networkFirst'
  }
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Cache statique: Pré-cache des ressources critiques');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Activation immédiate
      self.skipWaiting()
    ])
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Prise de contrôle immédiate
      self.clients.claim()
    ])
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Stratégie de cache selon le type de ressource
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isDynamicAsset(request.url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(networkFirst(request, API_CACHE));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME,
        timestamp: Date.now()
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'PRELOAD_RESOURCES':
      preloadResources(payload.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('🔄 Synchronisation en arrière-plan:', event.tag);
  
  switch (event.tag) {
    case 'background-sync':
      event.waitUntil(backgroundSync());
      break;
      
    case 'cache-update':
      event.waitUntil(updateCache());
      break;
  }
});

// Notifications push
self.addEventListener('push', (event) => {
  console.log('📱 Notification push reçue');
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification du Dashboard Pro',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Ignorer',
        icon: '/icons/action-dismiss.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification('Dashboard Pro', options)
  );
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Clic sur notification:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// ========================================
// STRATÉGIES DE CACHE
// ========================================

// Cache First - pour les ressources statiques
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Erreur cacheFirst:', error);
    return new Response('Ressource non disponible hors ligne', { status: 503 });
  }
}

// Network First - pour les APIs
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Réseau indisponible, utilisation du cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Service indisponible hors ligne', { status: 503 });
  }
}

// Stale While Revalidate - pour les ressources dynamiques
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('/static/') ||
         url.includes('/manifest.json') ||
         url.includes('/favicon.ico');
}

function isDynamicAsset(url) {
  return DYNAMIC_PATTERNS.some(pattern => pattern.test(url));
}

function isAPIRequest(url) {
  return API_PATTERNS.some(pattern => pattern.test(url));
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

async function preloadResources(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return Promise.all(
    urls.map(url => 
      fetch(url).then(response => {
        if (response.ok) {
          cache.put(url, response);
        }
      }).catch(error => {
        console.warn('Échec du préchargement:', url, error);
      })
    )
  );
}

async function backgroundSync() {
  console.log('🔄 Synchronisation en arrière-plan...');
  
  try {
    // Synchroniser les données en attente
    const pendingData = await getPendingData();
    
    for (const data of pendingData) {
      await syncData(data);
    }
    
    console.log('✅ Synchronisation terminée');
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error);
  }
}

async function updateCache() {
  console.log('🔄 Mise à jour du cache...');
  
  try {
    // Mettre à jour les ressources critiques
    const cache = await caches.open(STATIC_CACHE);
    
    for (const asset of STATIC_ASSETS) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
        }
      } catch (error) {
        console.warn('Échec de mise à jour:', asset);
      }
    }
    
    console.log('✅ Cache mis à jour');
  } catch (error) {
    console.error('❌ Erreur de mise à jour du cache:', error);
  }
}

// Fonctions de synchronisation (à implémenter selon les besoins)
async function getPendingData() {
  // Récupérer les données en attente de synchronisation
  return [];
}

async function syncData(data) {
  // Synchroniser une donnée spécifique
  console.log('Synchronisation de:', data);
}

// ========================================
// GESTION DES ERREURS
// ========================================

self.addEventListener('error', (event) => {
  console.error('Erreur Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Promesse rejetée non gérée:', event.reason);
});

console.log('🎯 Service Worker Dashboard Pro chargé et prêt !');