// components/InstallPrompt.jsx
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone,  Monitor } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 5 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    });

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      console.log('App installed successfully!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Check if dismissed recently
  useEffect(() => {
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime) {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime) < sevenDays) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-2xl max-w-sm">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Download className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold">Install ReceiptIt App</h3>
                <p className="text-sm text-green-100">Use offline like a native app</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <Smartphone className="mx-auto mb-1" size={16} />
              <div className="text-xs">Mobile App</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <Monitor className="mx-auto mb-1" size={16} />
              <div className="text-xs">Desktop App</div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleInstall}
              className="w-full bg-white text-green-600 font-bold py-2.5 rounded-lg hover:bg-green-50 transition-colors"
            >
              Install Now
            </button>
            <button
              onClick={handleClose}
              className="w-full text-green-100 text-sm py-1.5 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-white/20">
            <div className="text-xs text-green-200">
              <span className="font-medium">Benefits:</span> Works offline • App icon • Fast loading • No browser tabs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;