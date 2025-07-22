import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Contrast,
  Keyboard,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  soundEffects: boolean;
}

const AccessibilityEnhancer: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>('accessibility-settings', {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    soundEffects: true
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Set CSS custom properties
    root.style.setProperty('--motion-duration', settings.reducedMotion ? '0s' : '0.3s');
    
  }, [settings]);

  useEffect(() => {
    // Keyboard navigation handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;
      
      // Alt + A: Toggle accessibility panel
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      
      // Alt + C: Toggle high contrast
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
      }
      
      // Alt + T: Toggle large text
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        setSettings(prev => ({ ...prev, largeText: !prev.largeText }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, isVisible, setSettings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Provide audio feedback if enabled
    if (settings.soundEffects) {
      const audio = new Audio();
      audio.volume = 0.1;
      audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFApGn+DyvmMcBjiR2O/JdisGJXfH8N/2QAoUXrTp67pVFA==`;
      audio.play().catch(() => {}); // Ignore errors
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        aria-label="Open accessibility settings"
        title="Open accessibility settings (Alt + A)"
      >
        <Eye className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-xl border-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Accessibility</h3>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            aria-label="Close accessibility settings"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Contrast className="w-4 h-4" />
              <span className="text-sm">High Contrast</span>
            </div>
            <Button
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
              variant={settings.highContrast ? 'default' : 'outline'}
              size="sm"
              aria-pressed={settings.highContrast}
            >
              {settings.highContrast ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <span className="text-sm">Large Text</span>
            </div>
            <Button
              onClick={() => updateSetting('largeText', !settings.largeText)}
              variant={settings.largeText ? 'default' : 'outline'}
              size="sm"
              aria-pressed={settings.largeText}
            >
              {settings.largeText ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">Reduced Motion</span>
            </div>
            <Button
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
              variant={settings.reducedMotion ? 'default' : 'outline'}
              size="sm"
              aria-pressed={settings.reducedMotion}
            >
              {settings.reducedMotion ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Keyboard className="w-4 h-4" />
              <span className="text-sm">Keyboard Navigation</span>
            </div>
            <Button
              onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
              variant={settings.keyboardNavigation ? 'default' : 'outline'}
              size="sm"
              aria-pressed={settings.keyboardNavigation}
            >
              {settings.keyboardNavigation ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-sm">Sound Effects</span>
            </div>
            <Button
              onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
              variant={settings.soundEffects ? 'default' : 'outline'}
              size="sm"
              aria-pressed={settings.soundEffects}
            >
              {settings.soundEffects ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t text-xs text-gray-600">
          <p>Keyboard shortcuts:</p>
          <p>• Alt + A: Toggle panel</p>
          <p>• Alt + C: Toggle contrast</p>
          <p>• Alt + T: Toggle large text</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityEnhancer;