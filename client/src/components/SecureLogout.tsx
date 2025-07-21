import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut, Loader2 } from 'lucide-react';
import { performSecureLogout } from '@/utils/sessionManager';

interface SecureLogoutProps {
  variant?: 'button' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SecureLogout = ({ variant = 'button', size = 'md', className = '' }: SecureLogoutProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Use the secure logout process
      performSecureLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const renderTrigger = () => {
    const baseClasses = `${className}`;
    
    switch (variant) {
      case 'icon':
        return (
          <Button
            variant="ghost"
            size={size}
            className={`${baseClasses} p-2`}
            onClick={() => setShowDialog(true)}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        );
      
      case 'text':
        return (
          <button
            className={`${baseClasses} flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors`}
            onClick={() => setShowDialog(true)}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        );
      
      default:
        return (
          <Button
            variant="outline"
            size={size}
            className={`${baseClasses} border-red-200 text-red-600 hover:bg-red-50`}
            onClick={() => setShowDialog(true)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        );
    }
  };

  return (
    <>
      {renderTrigger()}
      
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? This will clear all your session data and return you to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SecureLogout;