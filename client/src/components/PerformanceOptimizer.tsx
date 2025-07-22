import React, { memo, useMemo, lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  loadingMessage?: string;
}

export const LazyComponentWrapper: React.FC<PerformanceOptimizerProps> = memo(({ 
  children, 
  loadingMessage = 'Loading...' 
}) => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="md" message={loadingMessage} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
});

LazyComponentWrapper.displayName = 'LazyComponentWrapper';

// Performance utilities for memoized components

// Performance hooks
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useMemo(() => callback, deps) as T;
};

// Virtual scrolling for large lists
interface VirtualizedListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = memo(({
  items,
  itemHeight,
  containerHeight,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => 
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

export default PerformanceOptimizer;