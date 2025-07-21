import React from 'react';
import { Loader2, Building } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  type?: 'login' | 'role-switch' | 'navigation' | 'general';
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ 
  message = 'Loading...', 
  type = 'general',
  size = 'md' 
}: LoadingSpinnerProps) => {
  
  const getMessages = () => {
    switch (type) {
      case 'login':
        return {
          primary: 'Logging in...',
          secondary: 'Validating credentials and setting up session'
        };
      case 'role-switch':
        return {
          primary: 'Switching Role...',
          secondary: 'Updating permissions and redirecting to dashboard'
        };
      case 'navigation':
        return {
          primary: 'Loading Page...',
          secondary: 'Checking access permissions'
        };
      default:
        return {
          primary: message,
          secondary: 'Please wait while we process your request'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          spinner: 'h-6 w-6',
          title: 'text-base',
          subtitle: 'text-xs'
        };
      case 'lg':
        return {
          container: 'p-8',
          spinner: 'h-12 w-12',
          title: 'text-2xl',
          subtitle: 'text-base'
        };
      default:
        return {
          container: 'p-6',
          spinner: 'h-8 w-8',
          title: 'text-lg',
          subtitle: 'text-sm'
        };
    }
  };

  const messages = getMessages();
  const sizeClasses = getSizeClasses();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className={`text-center space-y-4 ${sizeClasses.container}`}>
        {/* Logo and Spinner */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-br from-lush-primary to-lush-accent rounded-xl p-2 shadow-lg">
            <Building className="h-6 w-6 text-white" />
          </div>
          <Loader2 className={`${sizeClasses.spinner} animate-spin text-lush-primary`} />
        </div>
        
        {/* Loading Messages */}
        <div className="space-y-2">
          <h3 className={`${sizeClasses.title} font-medium text-gray-900`}>
            {messages.primary}
          </h3>
          <p className={`${sizeClasses.subtitle} text-gray-600`}>
            {messages.secondary}
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-48 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lush-primary to-lush-accent rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Brand Footer */}
        <div className="text-xs text-gray-500 mt-6">
          Lush Properties Pty Ltd
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;