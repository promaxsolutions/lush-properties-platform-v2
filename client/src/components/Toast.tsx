import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ToastProps {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // Wait for fade out animation
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-white border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`
      fixed z-50 flex items-center p-4 mb-4 border rounded-lg shadow-lg max-w-sm w-full
      transition-all duration-300 ease-in-out transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${getVariantStyles()}
    `}>
      {getIcon() && (
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
      )}
      
      <div className="flex-grow">
        {title && (
          <div className="font-medium text-sm mb-1">{title}</div>
        )}
        <div className="text-sm">{description}</div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="flex-shrink-0 ml-3 p-1 hover:bg-black/10"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
};

export default Toast;