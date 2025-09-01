// Utilitaires PWA pour le Dashboard

// Fonction d'installation PWA
export const installPWA = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Afficher un bouton d'installation personnalisé
    const installButton = document.createElement('button');
    installButton.innerText = 'Installer l\'App';
    installButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded fixed bottom-4 right-4 z-50';
    
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA installation ${outcome}`);
        deferredPrompt = null;
        installButton.remove();
      }
    });
    
    document.body.appendChild(installButton);
    
    // Auto-remove après 10 secondes
    setTimeout(() => {
      if (installButton && installButton.parentNode) {
        installButton.remove();
      }
    }, 10000);
  });
};

// Export de données en CSV
export const exportToCSV = (data, filename = 'dashboard_data') => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// Export de données en JSON  
export const exportToJSON = (data, filename = 'dashboard_data') => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
};

// Utilitaire de conversion CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

// Utilitaire de téléchargement
const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Stockage sécurisé pour le coffre-fort (simulation AES)
export const secureStorage = {
  // Clé de chiffrement simple (en prod, utiliser une vraie lib crypto)
  encryptionKey: 'dashboard_secure_key_2024',
  
  // Chiffrement simple (simulation)
  encrypt: (data) => {
    try {
      return btoa(JSON.stringify(data) + secureStorage.encryptionKey);
    } catch (e) {
      console.error('Encryption error:', e);
      return null;
    }
  },
  
  // Déchiffrement simple
  decrypt: (encryptedData) => {
    try {
      const decoded = atob(encryptedData);
      const data = decoded.replace(secureStorage.encryptionKey, '');
      return JSON.parse(data);
    } catch (e) {
      console.error('Decryption error:', e);
      return null;
    }
  },
  
  // Stocker une clé API de façon sécurisée
  storeApiKey: (service, key) => {
    const encryptedKey = secureStorage.encrypt({ service, key });
    if (encryptedKey) {
      localStorage.setItem(`secure_${service}`, encryptedKey);
      return true;
    }
    return false;
  },
  
  // Récupérer une clé API
  getApiKey: (service) => {
    const encrypted = localStorage.getItem(`secure_${service}`);
    if (encrypted) {
      const decrypted = secureStorage.decrypt(encrypted);
      return decrypted ? decrypted.key : null;
    }
    return null;
  },
  
  // Lister toutes les clés stockées
  listStoredKeys: () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('secure_')) {
        keys.push(key.replace('secure_', ''));
      }
    }
    return keys;
  },
  
  // Supprimer une clé
  removeApiKey: (service) => {
    localStorage.removeItem(`secure_${service}`);
  }
};

// Gestion des notifications
export const notificationManager = {
  // Demander la permission pour les notifications
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },
  
  // Envoyer une notification
  sendNotification: (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  },
  
  // Notification de projet créé
  projectCreated: (projectName) => {
    notificationManager.sendNotification('Nouveau projet créé', {
      body: `Le projet "${projectName}" a été créé avec succès`,
      tag: 'project-created'
    });
  },
  
  // Notification de tâche terminée
  taskCompleted: (taskName) => {
    notificationManager.sendNotification('Tâche terminée', {
      body: `La tâche "${taskName}" est maintenant terminée`,
      tag: 'task-completed'
    });
  }
};

// Utilitaires de performance
export const performanceUtils = {
  // Données exemple pour les graphs (à remplacer par vraies données)
  generateSampleData: (days = 30) => {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 1000),
        users: Math.floor(Math.random() * 500),
        projects: Math.floor(Math.random() * 10),
        completion: Math.floor(Math.random() * 100)
      });
    }
    
    return data;
  },
  
  // Calculer les métriques de base
  calculateMetrics: (data) => {
    if (!data || data.length === 0) {
      return {
        totalViews: 0,
        totalUsers: 0,
        avgCompletion: 0,
        growth: 0
      };
    }
    
    const totalViews = data.reduce((sum, item) => sum + item.views, 0);
    const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
    const avgCompletion = data.reduce((sum, item) => sum + item.completion, 0) / data.length;
    
    // Calculer la croissance (dernières 7 vs 7 précédentes)
    const recent = data.slice(-7);
    const previous = data.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, item) => sum + item.views, 0) / recent.length;
    const previousAvg = previous.reduce((sum, item) => sum + item.views, 0) / previous.length;
    
    const growth = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
    
    return {
      totalViews,
      totalUsers,
      avgCompletion: Math.round(avgCompletion),
      growth: Math.round(growth * 100) / 100
    };
  }
};