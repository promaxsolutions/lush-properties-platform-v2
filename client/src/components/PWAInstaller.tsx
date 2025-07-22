import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/useToast';
import { 
  Download, 
  Smartphone, 
  Chrome, 
  X, 
  CheckCircle,
  Info,
  Share
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissed, setDismissed] = useLocalStorage('pwa-install-dismissed', false);
  const { success, info } = useToast();

  // Detect iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isInStandaloneMode);

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      success('Lush Properties app installed successfully!', 'App Installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [success]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual instructions for browsers that don't support the API
      setShowInstructions(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        success('Installation started!', 'Installing App');
        setIsInstallable(false);
      } else {
        info('Installation cancelled', 'No worries!');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation failed:', error);
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowInstructions(false);
  };

  // Don't show if already installed or dismissed
  if (isInstalled || dismissed) {
    return null;
  }

  // iOS Installation Instructions Modal
  if (showInstructions && isIOS) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Install Lush Properties
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              To install this app on your iPhone/iPad:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                  1
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Share className="w-4 h-4" />
                  <span>Tap the Share button</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                  2
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="w-4 h-4" />
                  <span>Select "Add to Home Screen"</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                  3
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Tap "Add" to confirm</span>
                </div>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The app icon will appear on your home screen for quick access.
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleDismiss} className="w-full">
              Got it!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chrome/Android Installation Instructions
  if (showInstructions && !isIOS) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Chrome className="w-5 h-5" />
                Install Lush Properties
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              To install this app:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                  1
                </Badge>
                <span className="text-sm">Click the menu button (⋮) in your browser</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                  2
                </Badge>
                <span className="text-sm">Select "Install Lush Properties" or "Add to Home screen"</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                  3
                </Badge>
                <span className="text-sm">Click "Install" to confirm</span>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The app will be available as a standalone application on your device.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={handleDismiss} variant="outline" className="flex-1">
                Maybe Later
              </Button>
              <Button onClick={handleInstallClick} className="flex-1">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Install Prompt (appears when installable)
  if (isInstallable) {
    return (
      <Alert className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-40 border-2 border-lush-primary bg-white">
        <Download className="h-4 w-4" />
        <div className="flex-1">
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Install Lush Properties</p>
                <p className="text-xs text-gray-600">Get quick access and offline features</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleDismiss}>
                  <X className="w-3 h-3" />
                </Button>
                <Button size="sm" onClick={handleInstallClick} className="bg-lush-primary hover:bg-lush-primary/90">
                  <Download className="w-3 h-3 mr-1" />
                  Install
                </Button>
              </div>
            </div>
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return null;
};

export default PWAInstaller;