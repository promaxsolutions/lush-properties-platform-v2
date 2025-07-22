import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { ToastContainer } from './Toast';
import { useToast } from '@/hooks/useToast';
import { Toaster } from '@/components/ui/toaster';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {children}
        <ToastContainer 
          toasts={toasts.map(toast => ({ ...toast, onClose: removeToast }))} 
          onRemoveToast={removeToast} 
        />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default AppWrapper;