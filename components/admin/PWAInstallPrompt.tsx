'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                             (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if previously dismissed
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
      }
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom prompt after a delay
    if (isIOSDevice && !isStandaloneMode && !wasDismissed) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed, dismissed, or no prompt available
  if (isStandalone || dismissed || (!showPrompt && !isIOS)) {
    return null;
  }

  // iOS-specific instructions
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-amber-500/30 p-4 z-50 animate-in slide-in-from-bottom-4">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Smartphone className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Install ChauffeurTop</h3>
            <p className="text-sm text-gray-300 mb-3">
              Add to your home screen for quick access and push notifications
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>1. Tap the <span className="text-amber-400">Share</span> button below</p>
              <p>2. Scroll and tap <span className="text-amber-400">"Add to Home Screen"</span></p>
              <p>3. Tap <span className="text-amber-400">"Add"</span> to confirm</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chrome/Android install prompt
  if (deferredPrompt && showPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-amber-500/30 p-4 z-50 animate-in slide-in-from-bottom-4">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Download className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Install ChauffeurTop App</h3>
            <p className="text-sm text-gray-300 mb-3">
              Get instant notifications for new bookings and quotes
            </p>
            <button
              onClick={handleInstall}
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              Install Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
