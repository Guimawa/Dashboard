import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Bell, 
  BellOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Monitor,
  Zap,
  Shield
} from 'lucide-react';

// ------------------------------------------------------------
// PWA MANAGER - GESTIONNAIRE PWA COMPLET
// Installation, notifications, mode hors ligne, synchronisation
// ------------------------------------------------------------

const PWAManager = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [pwaStats, setPwaStats] = useState({
    cacheSize: 0,
    lastUpdate: null,
    version: '1.0.0'
  });

  // Vérifier l'état de l'installation PWA
  useEffect(() => {
    // Vérifier si l'app est installée
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isInApp);
    };

    checkInstallation();
    window.addEventListener('resize', checkInstallation);

    // Gestionnaire d'installation PWA
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Gestionnaire d'installation terminée
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('✅ PWA installée avec succès');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('resize', checkInstallation);
    };
  }, []);

  // Gestion de la connectivité
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enregistrement du Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          setSwRegistration(registration);
          console.log('✅ Service Worker enregistré:', registration);

          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Vérifier les notifications
          if ('Notification' in window) {
            setNotificationsEnabled(Notification.permission === 'granted');
          }
        })
        .catch((error) => {
          console.error('❌ Erreur Service Worker:', error);
        });
    }
  }, []);

  // Installer la PWA
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      const result = await deferredPrompt.prompt();
      console.log('Résultat installation:', result);
      
      if (result.outcome === 'accepted') {
        console.log('✅ Installation acceptée');
      } else {
        console.log('❌ Installation refusée');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erreur installation:', error);
    }
  };

  // Activer les notifications
  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Les notifications ne sont pas supportées par ce navigateur');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        // Envoyer une notification de test
        new Notification('Dashboard Pro', {
          body: 'Notifications activées avec succès !',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png'
        });
      }
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  };

  // Mettre à jour l'application
  const handleUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Vider le cache
  const handleClearCache = async () => {
    if (swRegistration) {
      try {
        await swRegistration.active.postMessage({ type: 'CLEAR_CACHE' });
        alert('Cache vidé avec succès');
      } catch (error) {
        console.error('Erreur vidage cache:', error);
      }
    }
  };

  // Obtenir les statistiques PWA
  const getPWAStats = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        setPwaStats(prev => ({
          ...prev,
          cacheSize: Math.round((estimate.usage || 0) / 1024 / 1024), // MB
          lastUpdate: new Date().toLocaleString('fr-FR')
        }));
      } catch (error) {
        console.error('Erreur statistiques:', error);
      }
    }
  };

  useEffect(() => {
    getPWAStats();
    const interval = setInterval(getPWAStats, 30000); // Toutes les 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Gestionnaire PWA</h1>
            <Monitor className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-slate-300 text-lg">
            Gérez l'installation, les notifications et les fonctionnalités hors ligne
          </p>
        </div>

        {/* Statut de connexion */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </h3>
                <p className="text-slate-300 text-sm">
                  {isOnline ? 'Connexion active' : 'Mode hors ligne activé'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isOnline ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Installation PWA */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Installation</h3>
            </div>
            
            {isInstalled ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Application installée</span>
                </div>
                <p className="text-slate-300 text-sm">
                  L'application est installée et fonctionne en mode standalone
                </p>
              </div>
            ) : deferredPrompt ? (
              <div className="space-y-3">
                <p className="text-slate-300 text-sm mb-3">
                  Installez l'application pour une meilleure expérience
                </p>
                <button
                  onClick={handleInstall}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Installer l'application
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">
                  L'installation n'est pas disponible sur ce navigateur
                </p>
                <div className="text-xs text-slate-400">
                  Essayez Chrome, Edge ou Safari sur mobile
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              {notificationsEnabled ? (
                <Bell className="w-6 h-6 text-green-400" />
              ) : (
                <BellOff className="w-6 h-6 text-slate-400" />
              )}
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {notificationsEnabled ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                )}
                <span className={`text-sm ${notificationsEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                  {notificationsEnabled ? 'Activées' : 'Désactivées'}
                </span>
              </div>
              
              {!notificationsEnabled && (
                <button
                  onClick={handleEnableNotifications}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Activer les notifications
                </button>
              )}
            </div>
          </div>

          {/* Mise à jour */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Mise à jour</h3>
            </div>
            
            <div className="space-y-3">
              {updateAvailable ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Mise à jour disponible</span>
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Mettre à jour
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Application à jour</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques PWA */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Statistiques PWA</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{pwaStats.cacheSize} MB</div>
              <div className="text-sm text-slate-400">Taille du cache</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{pwaStats.version}</div>
              <div className="text-sm text-slate-400">Version actuelle</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {pwaStats.lastUpdate ? 'Récent' : 'N/A'}
              </div>
              <div className="text-sm text-slate-400">Dernière mise à jour</div>
            </div>
          </div>
        </div>

        {/* Actions avancées */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Actions Avancées</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleClearCache}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Vider le cache
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Recharger l'application
            </button>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="mt-6 text-center">
          <div className="text-sm text-slate-400">
            <p>Dashboard Pro PWA v{pwaStats.version}</p>
            <p>Service Worker: {swRegistration ? 'Actif' : 'Inactif'}</p>
            <p>Mode: {isInstalled ? 'Standalone' : 'Navigateur'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAManager;
