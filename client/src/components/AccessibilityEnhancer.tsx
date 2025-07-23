import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Moon, Sun, Type, Minus, Plus, Zap } from 'lucide-react';

const AccessibilityEnhancer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Load saved accessibility preferences
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('accessibility-font-size') || '16');
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true';

    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
    setReducedMotion(savedReducedMotion);

    // Apply settings
    applyAccessibilitySettings(savedHighContrast, savedFontSize, savedReducedMotion);
  }, []);

  const applyAccessibilitySettings = (contrast: boolean, size: number, motion: boolean) => {
    const root = document.documentElement;
    
    if (contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.style.fontSize = `${size}px`;

    if (motion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('accessibility-high-contrast', String(newValue));
    applyAccessibilitySettings(newValue, fontSize, reducedMotion);
  };

  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + increment));
    setFontSize(newSize);
    localStorage.setItem('accessibility-font-size', String(newSize));
    applyAccessibilitySettings(highContrast, newSize, reducedMotion);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('accessibility-reduced-motion', String(newValue));
    applyAccessibilitySettings(highContrast, fontSize, newValue);
  };

  if (!isVisible) {
    return (
      <div style={{ position: 'fixed', bottom: '180px', right: '24px', zIndex: 35 }}>
        <Button
          onClick={() => setIsVisible(true)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
          aria-label="Accessibility Options"
          title="Accessibility Options"
        >
          <Eye className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '240px', right: '24px', zIndex: 35 }}>
      <Card className="w-64 shadow-xl border-2 bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Accessibility
            </h3>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-3">
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">High Contrast</span>
              <Button
                onClick={toggleHighContrast}
                variant={highContrast ? "default" : "outline"}
                size="sm"
                className="p-2"
              >
                {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>

            {/* Font Size Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Font Size</span>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => adjustFontSize(-2)}
                  variant="outline"
                  size="sm"
                  className="p-1 h-6 w-6"
                  disabled={fontSize <= 12}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xs px-2">{fontSize}px</span>
                <Button
                  onClick={() => adjustFontSize(2)}
                  variant="outline"
                  size="sm"
                  className="p-1 h-6 w-6"
                  disabled={fontSize >= 24}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Reduce Motion</span>
              <Button
                onClick={toggleReducedMotion}
                variant={reducedMotion ? "default" : "outline"}
                size="sm"
                className="p-2"
              >
                <Zap className={`w-4 h-4 ${reducedMotion ? '' : 'animate-pulse'}`} />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 text-center">
              Settings saved automatically
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityEnhancer;