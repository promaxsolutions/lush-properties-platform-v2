import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Smartphone, Download } from 'lucide-react';

interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const MobilePWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as PWAInstallPromptEvent);
      
      // Show install banner after 3 seconds if user hasn't dismissed it
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowInstallBanner(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      handleManualInstall();
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleManualInstall = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';

    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      // iOS Safari
      instructions = 'Tap the Share button (□↗) → Add to Home Screen';
    } else if (userAgent.includes('chrome')) {
      // Chrome/Android
      instructions = 'Tap the menu (⋮) → Add to Home screen';
    } else {
      instructions = 'Look for "Add to Home Screen" in your browser menu';
    }

    alert(`Install Lush Properties App:\n\n${instructions}`);
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled || !showInstallBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-20 z-30 md:hidden">
      <Card className="bg-[#007144] text-white shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-white/20 rounded-lg">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">Install Lush Properties</h3>
                <p className="text-xs text-white/90 mt-1">
                  Get the full mobile experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <Button
                onClick={handleInstallClick}
                size="sm"
                variant="secondary"
                className="bg-white text-[#007144] hover:bg-white/90 h-8 px-3"
              >
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
              <Button
                onClick={dismissBanner}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobilePWAInstaller;