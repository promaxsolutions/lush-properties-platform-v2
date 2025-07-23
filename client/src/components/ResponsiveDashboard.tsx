import React, { useState, useEffect } from 'react';
import Dashboard from './lush-dashboard';
import MobileDashboard from './MobileDashboard';

const ResponsiveDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for screen size changes
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Return the appropriate dashboard based on screen size
  return isMobile ? <MobileDashboard /> : <Dashboard />;
};

export default ResponsiveDashboard;