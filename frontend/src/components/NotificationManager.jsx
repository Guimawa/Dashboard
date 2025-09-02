import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  X,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

// ------------------------------------------------------------
// NOTIFICATION MANAGER - GESTIONNAIRE DE NOTIFICATIONS PWA
// Configuration, envoi, historique des notifications
// ------------------------------------------------------------

const NotificationManager = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    sound: true,
    vibration: true,
    desktop: true,
    mobile: true,
    projectUpdates: true,
    deadlines: true,
    systemAlerts: true
  });
  const [newNotification, setNewNotification] = useState({
    title: '',
    body: '',
    type: 'info',
    scheduled: false,
    scheduleTime: ''
  });

  // Types de notifications
  const notificationTypes = {
    info: { label: 'Information', color: 'blue', icon: 'ℹ️' },
    success: { label: 'Succès', color: 'green', icon: '✅' },
    warning: { label: 'Avertissement', color: 'yellow', icon: '⚠️' },
    error: { label: 'Erreur', color: 'red', icon: '❌' },
    project: { label: 'Projet', color: 'purple', icon: '📁' },
    deadline: { label: 'Échéance', color: 'orange', icon: '⏰' }
  };

  // Demander la permission pour les notifications
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Les notifications ne sont pas supportées par ce navigateur');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Envoyer une notification de test
        sendTestNotification();
      }
    } catch (error) {
      console.error('Erreur demande permission:', error);
    }
  };

  // Envoyer une notification de test
  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Dashboard Pro - Test', {
        body: 'Les notifications sont maintenant activées !',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'test-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Ouvrir',
            icon: '/icons/action-open.png'
          }
        ]
      });
    }
  };

  // Envoyer une notification personnalisée
  const sendCustomNotification = () => {
    if (permission !== 'granted') {
      alert('Les notifications ne sont pas autorisées');
      return;
    }

    if (!newNotification.title.trim() || !newNotification.body.trim()) {
      alert('Veuillez remplir le titre et le contenu');
      return;
    }

    const notification = new Notification(newNotification.title, {
      body: newNotification.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: `custom-${Date.now()}`,
      requireInteraction: true,
      vibrate: settings.vibration ? [200, 100, 200] : undefined,
      actions: [
        {
          action: 'open',
          title: 'Ouvrir Dashboard',
          icon: '/icons/action-open.png'
        },
        {
          action: 'dismiss',
          title: 'Ignorer',
          icon: '/icons/action-dismiss.png'
        }
      ]
    });

    // Ajouter à l'historique
    const notificationData = {
      id: Date.now(),
      title: newNotification.title,
      body: newNotification.body,
      type: newNotification.type,
      timestamp: new Date(),
      sent: true
    };

    setNotifications(prev => [notificationData, ...prev]);
    setNewNotification({ title: '', body: '', type: 'info', scheduled: false, scheduleTime: '' });

    // Gérer les clics sur la notification
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  // Programmer une notification
  const scheduleNotification = () => {
    if (!newNotification.scheduleTime) {
      alert('Veuillez sélectionner une heure');
      return;
    }

    const scheduleDate = new Date(newNotification.scheduleTime);
    const now = new Date();

    if (scheduleDate <= now) {
      alert('L\'heure programmée doit être dans le futur');
      return;
    }

    const delay = scheduleDate.getTime() - now.getTime();

    setTimeout(() => {
      sendCustomNotification();
    }, delay);

    // Ajouter à l'historique comme programmée
    const notificationData = {
      id: Date.now(),
      title: newNotification.title,
      body: newNotification.body,
      type: newNotification.type,
      timestamp: scheduleDate,
      sent: false,
      scheduled: true
    };

    setNotifications(prev => [notificationData, ...prev]);
    setNewNotification({ title: '', body: '', type: 'info', scheduled: false, scheduleTime: '' });

    alert(`Notification programmée pour ${scheduleDate.toLocaleString('fr-FR')}`);
  };

  // Supprimer une notification de l'historique
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Simuler des notifications système
  const simulateSystemNotifications = () => {
    const systemNotifications = [
      {
        title: 'Nouveau projet créé',
        body: 'Le projet "Application Mobile" a été créé avec succès',
        type: 'success'
      },
      {
        title: 'Échéance approchante',
        body: 'Le projet "Site E-commerce" arrive à échéance dans 2 jours',
        type: 'warning'
      },
      {
        title: 'Mise à jour disponible',
        body: 'Une nouvelle version du Dashboard Pro est disponible',
        type: 'info'
      },
      {
        title: 'Erreur de synchronisation',
        body: 'Impossible de synchroniser les données avec le serveur',
        type: 'error'
      }
    ];

    systemNotifications.forEach((notif, index) => {
      setTimeout(() => {
        if (permission === 'granted') {
          new Notification(notif.title, {
            body: notif.body,
            icon: '/icons/icon-192x192.png',
            tag: `system-${index}`,
            requireInteraction: true
          });

          // Ajouter à l'historique
          const notificationData = {
            id: Date.now() + index,
            title: notif.title,
            body: notif.body,
            type: notif.type,
            timestamp: new Date(),
            sent: true
          };

          setNotifications(prev => [notificationData, ...prev]);
        }
      }, index * 2000); // Espacer de 2 secondes
    });
  };

  // Formater la date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bell className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Gestionnaire de Notifications</h1>
            <Settings className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-300 text-lg">
            Configurez et gérez les notifications push de votre dashboard
          </p>
        </div>

        {/* Statut des permissions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {permission === 'granted' ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Permissions Notifications
                </h3>
                <p className="text-slate-300 text-sm">
                  {permission === 'granted' ? 'Autorisées' : 
                   permission === 'denied' ? 'Refusées' : 'Non demandées'}
                </p>
              </div>
            </div>
            
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Autoriser les notifications
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration */}
          <div className="space-y-6">
            {/* Paramètres généraux */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Paramètres Généraux</h3>
              
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-slate-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, [key]: !value }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-purple-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Envoyer une notification */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Envoyer une Notification</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la notification"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contenu
                  </label>
                  <textarea
                    value={newNotification.body}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Contenu de la notification"
                    className="w-full h-20 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(notificationTypes).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="scheduled"
                    checked={newNotification.scheduled}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, scheduled: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="scheduled" className="text-slate-300">
                    Programmer la notification
                  </label>
                </div>

                {newNotification.scheduled && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date et heure
                    </label>
                    <input
                      type="datetime-local"
                      value={newNotification.scheduleTime}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, scheduleTime: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={newNotification.scheduled ? scheduleNotification : sendCustomNotification}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    {newNotification.scheduled ? 'Programmer' : 'Envoyer'}
                  </button>
                  
                  <button
                    onClick={sendTestNotification}
                    className="px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Actions Rapides</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={simulateSystemNotifications}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  Simuler
                </button>
                
                <button
                  onClick={() => setNotifications([])}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Vider l'historique
                </button>
              </div>
            </div>
          </div>

          {/* Historique des notifications */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Historique des Notifications</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <BellOff className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">Aucune notification envoyée</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const typeInfo = notificationTypes[notification.type];
                  return (
                    <div key={notification.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{typeInfo.icon}</span>
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            {notification.scheduled && (
                              <Clock className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{notification.body}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>{formatDate(notification.timestamp)}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              notification.sent ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                            }`}>
                              {notification.sent ? 'Envoyée' : 'Programmée'}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;
