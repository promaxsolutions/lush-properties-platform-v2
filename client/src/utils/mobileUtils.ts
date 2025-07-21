// Mobile utility functions for Lush Properties app

export const isMobileDevice = (): boolean => {
  return typeof window !== 'undefined' && window.innerWidth < 768;
};

export const getTouchFriendlyButtonClass = (): string => {
  return 'min-h-[48px] px-4 py-3 text-sm active:scale-95 transition-transform';
};

export const getMobileGridClass = (cols: 1 | 2 | 3 = 2): string => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  };
  return `grid ${gridClasses[cols]} gap-3 sm:gap-4`;
};

export const getMobileTextClass = (size: 'xs' | 'sm' | 'base' | 'lg' = 'sm'): string => {
  const sizeClasses = {
    'xs': 'text-xs sm:text-sm',
    'sm': 'text-sm sm:text-base',
    'base': 'text-base sm:text-lg',
    'lg': 'text-lg sm:text-xl'
  };
  return sizeClasses[size];
};

export const getMobilePaddingClass = (): string => {
  return 'p-3 sm:p-4 lg:p-6';
};

export const triggerPWAInstall = (): void => {
  if ('serviceWorker' in navigator) {
    // For iOS Safari
    if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
      alert('To install: Tap the Share button → Add to Home Screen');
    } else if (navigator.userAgent.includes('Chrome')) {
      // For Chrome/Android
      alert('To install: Tap the menu (⋮) → Add to Home screen');
    } else {
      alert('Add Lush Properties to your home screen for the best mobile experience!');
    }
  }
};

export const optimizeTableForMobile = (element: HTMLElement): void => {
  if (isMobileDevice()) {
    element.style.overflowX = 'auto';
    element.style.whiteSpace = 'nowrap';
  }
};

export const getMobileCardClass = (): string => {
  return 'rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4';
};

export const getMobileFormClass = (): string => {
  return 'space-y-3 sm:space-y-4';
};

export const detectMobileCamera = (): boolean => {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
};