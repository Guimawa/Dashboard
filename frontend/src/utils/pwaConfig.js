// ------------------------------------------------------------
// CONFIGURATION PWA - MÉTADONNÉES ET CONFIGURATION
// Configuration centralisée pour toutes les fonctionnalités PWA
// ------------------------------------------------------------

export const PWA_CONFIG = {
  // Informations de base
  app: {
    name: 'Dashboard Pro',
    shortName: 'Dashboard Pro',
    description: 'Tableau de bord professionnel pour la gestion de projets numériques avec IA intégrée',
    version: '1.0.0',
    author: 'Dashboard Pro Team',
    lang: 'fr',
    dir: 'ltr'
  },

  // Configuration des couleurs
  theme: {
    primary: '#1e293b',
    secondary: '#0f172a',
    accent: '#3b82f6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#ffffff',
    textSecondary: '#94a3b8'
  },

  // Configuration du cache
  cache: {
    static: {
      name: 'dashboard-static-v1.0.0',
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      strategy: 'cacheFirst'
    },
    dynamic: {
      name: 'dashboard-dynamic-v1.0.0',
      maxEntries: 100,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
      strategy: 'staleWhileRevalidate'
    },
    api: {
      name: 'dashboard-api-v1.0.0',
      maxEntries: 50,
      maxAgeSeconds: 5 * 60, // 5 minutes
      strategy: 'networkFirst'
    }
  },

  // Ressources à mettre en cache
  assets: {
    static: [
      '/',
      '/static/js/bundle.js',
      '/static/css/main.css',
      '/manifest.json',
      '/favicon.ico',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png',
      '/dashboard',
      '/table-ronde',
      '/vault',
      '/dashboard-main'
    ],
    dynamic: [
      /^\/static\//,
      /^\/icons\//,
      /^\/screenshots\//,
      /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/
    ],
    api: [
      /^\/api\//,
      /^\/health$/
    ]
  },

  // Configuration des notifications
  notifications: {
    defaultIcon: '/icons/icon-192x192.png',
    defaultBadge: '/icons/icon-72x72.png',
    defaultVibrate: [200, 100, 200],
    defaultActions: [
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
    types: {
      info: { color: '#3b82f6', icon: 'ℹ️' },
      success: { color: '#10b981', icon: '✅' },
      warning: { color: '#f59e0b', icon: '⚠️' },
      error: { color: '#ef4444', icon: '❌' },
      project: { color: '#8b5cf6', icon: '📁' },
      deadline: { color: '#f97316', icon: '⏰' }
    }
  },

  // Configuration des raccourcis
  shortcuts: [
    {
      name: 'Table Ronde IA',
      shortName: 'IA Brainstorm',
      description: 'Lancer une session de brainstorm avec l\'IA',
      url: '/table-ronde',
      icon: '/icons/shortcut-ia.png'
    },
    {
      name: 'Coffre-fort',
      shortName: 'Vault',
      description: 'Accéder au coffre-fort sécurisé',
      url: '/vault',
      icon: '/icons/shortcut-vault.png'
    },
    {
      name: 'Nouveau Projet',
      shortName: 'New Project',
      description: 'Créer un nouveau projet',
      url: '/dashboard-main?tab=new-project',
      icon: '/icons/shortcut-new.png'
    },
    {
      name: 'Gestionnaire PWA',
      shortName: 'PWA Manager',
      description: 'Gérer les fonctionnalités PWA',
      url: '/pwa-manager',
      icon: '/icons/shortcut-pwa.png'
    }
  ],

  // Configuration des captures d'écran
  screenshots: [
    {
      src: '/screenshots/desktop-dashboard.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Vue d\'ensemble du dashboard'
    },
    {
      src: '/screenshots/mobile-dashboard.png',
      sizes: '390x844',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'Interface mobile du dashboard'
    }
  ],

  // Configuration des icônes
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any'
    }
  ],

  // Configuration du mode hors ligne
  offline: {
    fallbackPage: '/offline.html',
    cacheStrategy: 'networkFirst',
    syncInterval: 30000, // 30 secondes
    maxRetries: 3,
    retryDelay: 1000 // 1 seconde
  },

  // Configuration de l'installation
  install: {
    promptDelay: 3000, // 3 secondes
    dismissSession: true,
    showOnReturn: false,
    customPrompt: true
  },

  // Configuration de la synchronisation
  sync: {
    backgroundSync: true,
    syncTags: ['background-sync', 'cache-update'],
    maxRetries: 3,
    retryDelay: 1000
  },

  // Configuration des catégories
  categories: ['productivity', 'business', 'utilities'],

  // Configuration des fonctionnalités
  features: {
    standalone: true,
    fullscreen: false,
    orientation: 'portrait-primary',
    displayOverride: ['window-controls-overlay', 'standalone'],
    edgeSidePanel: {
      preferredWidth: 400
    },
    launchHandler: {
      clientMode: 'navigate-existing'
    }
  }
};

// Fonctions utilitaires
export const PWA_UTILS = {
  // Vérifier si l'app est installée
  isInstalled: () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInApp = window.navigator.standalone === true;
    return isStandalone || isInApp;
  },

  // Vérifier si le service worker est supporté
  isServiceWorkerSupported: () => {
    return 'serviceWorker' in navigator;
  },

  // Vérifier si les notifications sont supportées
  isNotificationSupported: () => {
    return 'Notification' in window;
  },

  // Vérifier si le cache est supporté
  isCacheSupported: () => {
    return 'caches' in window;
  },

  // Obtenir la taille du cache
  getCacheSize: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return Math.round((estimate.usage || 0) / 1024 / 1024); // MB
      } catch (error) {
        console.error('Erreur obtention taille cache:', error);
        return 0;
      }
    }
    return 0;
  },

  // Vider le cache
  clearCache: async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        return true;
      } catch (error) {
        console.error('Erreur vidage cache:', error);
        return false;
      }
    }
    return false;
  },

  // Envoyer une notification
  sendNotification: (title, options = {}) => {
    if (Notification.permission === 'granted') {
      const defaultOptions = {
        icon: PWA_CONFIG.notifications.defaultIcon,
        badge: PWA_CONFIG.notifications.defaultBadge,
        vibrate: PWA_CONFIG.notifications.defaultVibrate,
        requireInteraction: true,
        actions: PWA_CONFIG.notifications.defaultActions
      };

      return new Notification(title, { ...defaultOptions, ...options });
    }
    return null;
  },

  // Obtenir les informations du navigateur
  getBrowserInfo: () => {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent);

    return {
      isChrome,
      isFirefox,
      isSafari,
      isEdge,
      userAgent
    };
  }
};

export default PWA_CONFIG;
