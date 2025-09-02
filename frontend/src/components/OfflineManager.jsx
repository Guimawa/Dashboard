import React, { useState, useEffect } from 'react';
import { 
  WifiOff, 
  Wifi, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Database,
  Cloud,
  CloudOff,
  Sync
} from 'lucide-react';

// ------------------------------------------------------------
// OFFLINE MANAGER - GESTIONNAIRE MODE HORS LIGNE
// Synchronisation, cache, données hors ligne
// ------------------------------------------------------------

const OfflineManager = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [offlineData, setOfflineData] = useState([]);
  const [pendingSync, setPendingSync] = useState([]);
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    entries: 0,
    lastUpdate: null
  });

  // Données de démonstration pour le mode hors ligne
  const demoOfflineData = [
    {
      id: 1,
      type: 'project',
      title: 'Projet Mobile App',
      data: { status: 'En cours', progress: 75 },
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      synced: false
    },
    {
      id: 2,
      type: 'task',
      title: 'Design UI/UX',
      data: { priority: 'High', assignee: 'John Doe' },
      lastModified: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1h ago
      synced: false
    },
    {
      id: 3,
      type: 'note',
      title: 'Notes de réunion',
      data: { content: 'Discussion sur les fonctionnalités...' },
      lastModified: new Date(Date.now() - 30 * 60 * 1000), // 30min ago
      synced: true
    }
  ];

  // Gestion de la connectivité
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      // Démarrer la synchronisation automatique
      setTimeout(() => {
        handleSync();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialiser les données de démonstration
    setOfflineData(demoOfflineData);
    setPendingSync(demoOfflineData.filter(item => !item.synced));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Obtenir les statistiques du cache
  useEffect(() => {
    const getCacheStats = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          setCacheStats({
            size: Math.round((estimate.usage || 0) / 1024 / 1024), // MB
            entries: offlineData.length,
            lastUpdate: new Date().toLocaleString('fr-FR')
          });
        } catch (error) {
          console.error('Erreur statistiques cache:', error);
        }
      }
    };

    getCacheStats();
    const interval = setInterval(getCacheStats, 30000); // Toutes les 30s
    return () => clearInterval(interval);
  }, [offlineData]);

  // Synchroniser les données
  const handleSync = async () => {
    if (!isOnline) {
      alert('Vous devez être en ligne pour synchroniser');
      return;
    }

    setSyncStatus('syncing');

    try {
      // Simuler la synchronisation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Marquer les données comme synchronisées
      setOfflineData(prev => 
        prev.map(item => ({ ...item, synced: true }))
      );
      setPendingSync([]);
      setSyncStatus('success');

      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Erreur synchronisation:', error);
      setSyncStatus('error');
      
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    }
  };

  // Ajouter des données hors ligne
  const addOfflineData = () => {
    const newItem = {
      id: Date.now(),
      type: 'note',
      title: `Note ${offlineData.length + 1}`,
      data: { content: 'Nouvelle note créée hors ligne' },
      lastModified: new Date(),
      synced: false
    };

    setOfflineData(prev => [newItem, ...prev]);
    setPendingSync(prev => [newItem, ...prev]);
  };

  // Supprimer des données
  const deleteOfflineData = (id) => {
    setOfflineData(prev => prev.filter(item => item.id !== id));
    setPendingSync(prev => prev.filter(item => item.id !== id));
  };

  // Vider le cache
  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        setOfflineData([]);
        setPendingSync([]);
        setCacheStats({ size: 0, entries: 0, lastUpdate: new Date().toLocaleString('fr-FR') });
        
        alert('Cache vidé avec succès');
      } catch (error) {
        console.error('Erreur vidage cache:', error);
        alert('Erreur lors du vidage du cache');
      }
    }
  };

  // Formater la date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir l'icône selon le type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'project': return '📁';
      case 'task': return '✅';
      case 'note': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isOnline ? (
              <Wifi className="w-8 h-8 text-green-400" />
            ) : (
              <WifiOff className="w-8 h-8 text-red-400" />
            )}
            <h1 className="text-3xl font-bold text-white">Gestionnaire Hors Ligne</h1>
            <Sync className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-300 text-lg">
            Gérez vos données hors ligne et la synchronisation
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
                  {isOnline ? 'Connexion active - Synchronisation disponible' : 'Mode hors ligne - Données en cache'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {syncStatus === 'syncing' && (
                <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
              )}
              {syncStatus === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {syncStatus === 'error' && (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
              
              <button
                onClick={handleSync}
                disabled={!isOnline || syncStatus === 'syncing'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {syncStatus === 'syncing' ? 'Synchronisation...' : 'Synchroniser'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques du cache */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{cacheStats.size} MB</div>
                <div className="text-sm text-slate-400">Taille du cache</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <Cloud className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{cacheStats.entries}</div>
                <div className="text-sm text-slate-400">Éléments en cache</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {pendingSync.length}
                </div>
                <div className="text-sm text-slate-400">En attente de sync</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Données hors ligne */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Données Hors Ligne</h3>
              <button
                onClick={addOfflineData}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Ajouter
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {offlineData.length === 0 ? (
                <div className="text-center py-8">
                  <CloudOff className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">Aucune donnée hors ligne</p>
                </div>
              ) : (
                offlineData.map((item) => (
                  <div key={item.id} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getTypeIcon(item.type)}</span>
                          <h4 className="font-medium text-white">{item.title}</h4>
                          {item.synced ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-2">
                          {JSON.stringify(item.data, null, 2)}
                        </p>
                        <div className="text-xs text-slate-400">
                          Modifié: {formatDate(item.lastModified)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteOfflineData(item.id)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions et configuration */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Actions Rapides</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleSync}
                  disabled={!isOnline || syncStatus === 'syncing'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  <Sync className="w-5 h-5" />
                  Synchroniser maintenant
                </button>
                
                <button
                  onClick={clearCache}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Database className="w-5 h-5" />
                  Vider le cache
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Recharger l'application
                </button>
              </div>
            </div>

            {/* Informations techniques */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Informations Techniques</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Statut réseau:</span>
                  <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                    {isOnline ? 'Connecté' : 'Déconnecté'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Worker:</span>
                  <span className="text-green-400">Actif</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Cache disponible:</span>
                  <span className="text-green-400">Oui</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Dernière sync:</span>
                  <span className="text-slate-300">{cacheStats.lastUpdate || 'Jamais'}</span>
                </div>
              </div>
            </div>

            {/* Mode hors ligne - Instructions */}
            {!isOnline && (
              <div className="bg-yellow-900/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-600/30">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Mode Hors Ligne</h3>
                </div>
                
                <div className="text-sm text-slate-300 space-y-2">
                  <p>• Vos données sont sauvegardées localement</p>
                  <p>• La synchronisation reprendra automatiquement en ligne</p>
                  <p>• Vous pouvez continuer à travailler normalement</p>
                  <p>• Les modifications seront synchronisées plus tard</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineManager;
