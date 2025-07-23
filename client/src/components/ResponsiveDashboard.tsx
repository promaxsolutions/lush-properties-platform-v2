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

  // Return the appropriate dashboard based on screen size
  return isMobile ? <MobileDashboard /> : <Dashboard />;
};

export default ResponsiveDashboard;