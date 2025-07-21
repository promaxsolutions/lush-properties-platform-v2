import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
}

// Global scroll utility function
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    console.log('[SMOOTH-SCROLL] Scrolled to section:', id);
    
    // Add mobile haptic feedback
    if ('vibrate' in navigator && window.innerWidth <= 768) {
      navigator.vibrate(50);
    }
  }
};

// Make scrollToSection globally available
declare global {
  interface Window {
    scrollToSection: (id: string) => void;
  }
}

const SmoothScrollWrapper = ({ children }: SmoothScrollWrapperProps) => {
  const [location] = useLocation();

  useEffect(() => {
    // Make scroll function globally available
    window.scrollToSection = scrollToSection;
    
    // Handle hash navigation for fragment links
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the # symbol
        const elementId = hash.substring(1);
        setTimeout(() => {
          scrollToSection(elementId);
        }, 300); // Delay to allow page to render
      }
    };

    // Handle hash navigation on location change
    handleHashNavigation();
    
    // Enhanced smooth scrolling for internal links
    const handleInternalLinks = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const href = link.getAttribute('href');
        
        // Handle hash links (e.g., #projectSummary)
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const elementId = href.substring(1);
          scrollToSection(elementId);
          return;
        }
        
        // Handle internal navigation links
        if (link.href.startsWith(window.location.origin) && href && href.startsWith('/')) {
          // Check for hash in the URL
          if (href.includes('#')) {
            const [path, hash] = href.split('#');
            // If it's the same path, just scroll to the hash
            if (path === location || path === '') {
              e.preventDefault();
              scrollToSection(hash);
              return;
            }
          }
          
          // Regular navigation - scroll to top of main content
          setTimeout(() => {
            const mainContent = document.querySelector('main') || 
                              document.querySelector('[role="main"]') || 
                              document.querySelector('.main-content') ||
                              document.body;
            
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
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    
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
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, [location]);

  return <>{children}</>;
};

export default SmoothScrollWrapper;