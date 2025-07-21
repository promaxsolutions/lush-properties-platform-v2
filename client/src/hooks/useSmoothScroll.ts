import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

export const useSmoothScroll = () => {
  const [location] = useLocation();

  const scrollToSection = useCallback((id: string, offset: number = 0) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // Add mobile haptic feedback
      if ('vibrate' in navigator && window.innerWidth <= 768) {
        navigator.vibrate(50);
      }
      
      console.log('[SMOOTH-SCROLL] Scrolled to section:', id);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  // Handle hash navigation on location change
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const elementId = hash.substring(1);
      setTimeout(() => {
        scrollToSection(elementId, 80); // Offset for fixed headers
      }, 300);
    } else {
      // Scroll to top when navigating to new page without hash
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [location, scrollToSection, scrollToTop]);

  return {
    scrollToSection,
    scrollToTop,
    scrollToBottom
  };
};

export default useSmoothScroll;