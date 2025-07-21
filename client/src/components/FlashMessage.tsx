import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

interface FlashMessageProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  autoClose?: boolean;
}

const FlashMessage = ({ 
  message, 
  type, 
  duration = 4000, 
  onClose, 
  autoClose = true 
}: FlashMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Wait for animation
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  const getAlertClasses = () => {
    const baseClasses = "transition-all duration-300 ease-in-out border-l-4";
    const visibilityClasses = isVisible 
      ? "opacity-100 translate-y-0" 
      : "opacity-0 -translate-y-2";

    switch (type) {
      case 'success':
        return `${baseClasses} ${visibilityClasses} border-green-500 bg-green-50`;
      case 'error':
        return `${baseClasses} ${visibilityClasses} border-red-500 bg-red-50`;
      case 'warning':
        return `${baseClasses} ${visibilityClasses} border-orange-500 bg-orange-50`;
      case 'info':
        return `${baseClasses} ${visibilityClasses} border-blue-500 bg-blue-50`;
      default:
        return `${baseClasses} ${visibilityClasses} border-gray-500 bg-gray-50`;
    }
  };

  const getIcon = () => {
    const iconClasses = "h-4 w-4";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-600`} />;
      case 'error':
        return <AlertTriangle className={`${iconClasses} text-red-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-orange-600`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-600`} />;
      default:
        return <Info className={`${iconClasses} text-gray-600`} />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-orange-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  if (!isVisible && autoClose) {
    return null;
  }

  return (
    <Alert className={getAlertClasses()}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <AlertDescription className={getTextColor()}>
            {message}
          </AlertDescription>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Alert>
  );
};

export default FlashMessage;