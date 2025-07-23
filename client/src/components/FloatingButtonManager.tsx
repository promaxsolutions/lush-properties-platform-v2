import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, MessageCircle } from 'lucide-react';

interface FloatingButtonManagerProps {
  children: React.ReactNode;
}

const FloatingButtonManager: React.FC<FloatingButtonManagerProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="relative">
      {children}
      
      {/* Floating Button Container - Positioned to avoid overlaps */}
      <div className={`fixed ${isDesktop ? 'bottom-6 right-6' : 'bottom-4 right-4'} z-50 flex flex-col gap-3`}>
        {/* This container will hold floating buttons in proper order */}
        <div id="floating-buttons-container" className="flex flex-col gap-3 items-end">
          {/* Buttons will be portaled here in order */}
        </div>
      </div>
    </div>
  );
};

export default FloatingButtonManager;