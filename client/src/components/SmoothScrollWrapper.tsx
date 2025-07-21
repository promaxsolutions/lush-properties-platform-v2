import React, { useEffect } from 'react';

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
}

const SmoothScrollWrapper = ({ children }: SmoothScrollWrapperProps) => {
  useEffect(() => {
    // Enhanced smooth scrolling for internal links
    const handleInternalLinks = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        // Check if it's an internal navigation link
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
          // Add smooth scroll animation
          const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
          
          // Smooth scroll to top of main content
          setTimeout(() => {
            mainContent.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }, 100);
          
          // Add mobile haptic feedback
          if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(50);
          }
          
          console.log('[SMOOTH-SCROLL] Applied smooth scroll for:', href);
        }
      }
    };

    // Add click listener for smooth scrolling
    document.addEventListener('click', handleInternalLinks);
    
    // Enhanced mobile scroll behavior
    if (window.innerWidth <= 768) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Add momentum scrolling for iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        document.body.style.overscrollBehavior = 'contain';
        
        // Prevent scroll bounce on iOS
        document.body.addEventListener('touchstart', () => {}, { passive: true });
        document.body.addEventListener('touchmove', () => {}, { passive: true });
      }
    }
    
    return () => {
      document.removeEventListener('click', handleInternalLinks);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollWrapper;