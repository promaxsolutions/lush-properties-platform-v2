import React, { useState, useEffect } from 'react';
import Dashboard from './lush-dashboard';
import MobileDashboard from './MobileDashboard';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

const ResponsiveDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [forceDesktop, setForceDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      // Only set mobile if not forcing desktop and screen is small
      setIsMobile(!forceDesktop && width < 768);
      console.log(`[ResponsiveDashboard] Screen width: ${width}px, Mobile mode: ${!forceDesktop && width < 768}, Force Desktop: ${forceDesktop}`);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for screen size changes
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [forceDesktop]);

  // Debug display for current state
  useEffect(() => {
    console.log(`[ResponsiveDashboard] Rendering ${isMobile ? 'Mobile' : 'Desktop'} dashboard for ${screenWidth}px screen`);
  }, [isMobile, screenWidth]);

  const currentMode = isMobile ? 'Mobile' : 'Desktop';

  return (
    <div>
      {/* View Toggle for Testing */}
      <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-2 border">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-600">
            {screenWidth}px - {currentMode}
          </span>
          <Button
            size="sm"
            variant={forceDesktop ? "default" : "outline"}
            onClick={() => setForceDesktop(!forceDesktop)}
            className="h-8 px-2 text-xs"
          >
            {forceDesktop ? <Monitor className="h-3 w-3 mr-1" /> : <Smartphone className="h-3 w-3 mr-1" />}
            {forceDesktop ? 'Desktop' : 'Auto'}
          </Button>
        </div>
      </div>

      {/* Return the appropriate dashboard */}
      {isMobile ? <MobileDashboard /> : <Dashboard />}
    </div>
  );
};

export default ResponsiveDashboard;