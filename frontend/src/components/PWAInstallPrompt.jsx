import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';

// ------------------------------------------------------------
// PWA INSTALL PROMPT - PROMPT D'INSTALLATION PERSONNALISÉ
// Interface moderne pour l'installation de l'application
// ------------------------------------------------------------

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStep, setInstallStep] = useState(0);

  // Étapes d'installation
  const installSteps = [
    {
      title: "Installez Dashboard Pro",
      description: "Ajoutez l'application à votre écran d'accueil pour un accès rapide",
      icon: <Download className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Accès instantané",
      description: "Lancez l'application directement depuis votre bureau ou mobile",
      icon: <Zap className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "Mode hors ligne",
      description: "Travaillez même sans connexion internet",
      icon: <CheckCircle className="w-8 h-8 text-green-400" />
    }
  ];

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = window.navigator.standalone === true;
      const isInstalled = isStandalone || isInApp;
      
      setIsInstalled(isInstalled);
      
      // Ne pas afficher le prompt si déjà installé
      if (isInstalled) {
        setShowPrompt(false);
      }
    };

    checkInstallation();

    // Gestionnaire d'installation PWA
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Afficher le prompt après un délai (pour ne pas être trop intrusif)
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 3000); // 3 secondes après le chargement
    };

    // Gestionnaire d'installation terminée
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('✅ PWA installée avec succès');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('resize', checkInstallation);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('resize', checkInstallation);
    };
  }, [isInstalled]);

  // Installer l'application
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      setInstallStep(1);
      
      const result = await deferredPrompt.prompt();
      console.log('Résultat installation:', result);
      
      if (result.outcome === 'accepted') {
        setInstallStep(2);
        console.log('✅ Installation acceptée');
      } else {
        setInstallStep(0);
        console.log('❌ Installation refusée');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erreur installation:', error);
      setInstallStep(0);
    }
  };

  // Fermer le prompt
  const handleDismiss = () => {
    setShowPrompt(false);
    // Ne plus afficher pendant cette session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Vérifier si le prompt a été fermé dans cette session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      setShowPrompt(false);
    }
  }, []);

  // Ne pas afficher si déjà installé ou pas de prompt disponible
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-700 w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Dashboard Pro</h2>
                <p className="text-slate-300 text-sm">Application Web Progressive</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Étapes d'installation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {installSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index <= installStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {index < installStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-white">{step.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description actuelle */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              {installSteps[installStep]?.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {installSteps[installStep]?.title}
            </h3>
            <p className="text-slate-300 text-sm">
              {installSteps[installStep]?.description}
            </p>
          </div>

          {/* Avantages */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Avantages de l'installation :</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Accès rapide depuis l'écran d'accueil</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Fonctionnement hors ligne</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Notifications push</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Interface native</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Plus tard
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Installer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Star className="w-3 h-3" />
            <span>Gratuit • Sécurisé • Sans publicité</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
