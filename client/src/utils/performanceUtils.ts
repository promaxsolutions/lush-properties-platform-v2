// Performance utility functions for optimizing the application

// Debounce function for search inputs and API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Throttle function for scroll events and frequent operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func.apply(null, args);
  };
}

// Image optimization utilities
export const imageUtils = {
  // Generate optimized image URLs based on device pixel ratio
  getOptimizedImageUrl: (baseUrl: string, width: number, height: number) => {
    const pixelRatio = window.devicePixelRatio || 1;
    const optimizedWidth = Math.round(width * pixelRatio);
    const optimizedHeight = Math.round(height * pixelRatio);
    
    // This would typically integrate with a service like Cloudinary or similar
    return `${baseUrl}?w=${optimizedWidth}&h=${optimizedHeight}&q=auto&f=auto`;
  },
  
  // Preload important images
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },
  
  // Create responsive image srcSet
  createSrcSet: (baseUrl: string, sizes: number[]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  }
};

// Memory management utilities
export const memoryUtils = {
  // Clean up event listeners and timers
  cleanup: (...cleanupFunctions: (() => void)[]) => {
    return () => {
      cleanupFunctions.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      });
    };
  },
  
  // Weak map for storing component references without memory leaks
  createWeakCache: <K extends object, V>() => {
    return new WeakMap<K, V>();
  }
};

// Performance monitoring utilities
export const performanceUtils = {
  // Measure component render time
  measureRenderTime: (componentName: string, renderFn: () => void) => {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // 16ms threshold for 60fps
      console.warn(`${componentName} render time: ${renderTime.toFixed(2)}ms (exceeds 16ms)`);
    }
    
    return renderTime;
  },
  
  // Observe long tasks that might block the main thread
  observeLongTasks: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // 50ms threshold
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
        return () => observer.disconnect();
      } catch (error) {
        console.warn('Long task observation not supported');
        return () => {};
      }
    }
    return () => {};
  },
  
  // Track memory usage
  trackMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};

// Bundle size optimization utilities
export const bundleUtils = {
  // Dynamic import with error handling
  dynamicImport: async <T>(
    importFn: () => Promise<T>,
    fallback?: T
  ): Promise<T> => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      if (fallback) {
        return fallback;
      }
      throw error;
    }
  },
  
  // Feature detection for progressive enhancement
  supportsFeature: (feature: string): boolean => {
    switch (feature) {
      case 'webp':
        return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
      case 'webGL':
        try {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (error) {
          return false;
        }
      case 'serviceWorker':
        return 'serviceWorker' in navigator;
      case 'intersectionObserver':
        return 'IntersectionObserver' in window;
      default:
        return false;
    }
  }
};

// Network optimization utilities
export const networkUtils = {
  // Detect connection type
  getConnectionType: () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        saveData: connection.saveData
      };
    }
    return null;
  },
  
  // Adaptive loading based on connection
  shouldLoadHighQuality: () => {
    const connection = networkUtils.getConnectionType();
    if (!connection) return true; // Default to high quality if unknown
    
    return !connection.saveData && 
           connection.effectiveType !== 'slow-2g' && 
           connection.effectiveType !== '2g';
  }
};