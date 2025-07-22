import { useState, useCallback } from 'react';

export interface ToastData {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { id, ...toast };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback((options: Omit<ToastData, 'id'>) => {
    return addToast(options);
  }, [addToast]);

  // Convenience methods
  const success = useCallback((description: string, title?: string) => {
    return toast({ description, title, variant: 'success' });
  }, [toast]);

  const error = useCallback((description: string, title?: string) => {
    return toast({ description, title, variant: 'error' });
  }, [toast]);

  const warning = useCallback((description: string, title?: string) => {
    return toast({ description, title, variant: 'warning' });
  }, [toast]);

  const info = useCallback((description: string, title?: string) => {
    return toast({ description, title, variant: 'info' });
  }, [toast]);

  return {
    toast,
    success,
    error,
    warning,
    info,
    toasts,
    removeToast
  };
}