import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RoleRefreshButtonProps {
  currentRole?: string;
  expectedRole?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "destructive";
}

const RoleRefreshButton = ({ 
  currentRole, 
  expectedRole, 
  className = "", 
  size = "default",
  variant = "outline" 
}: RoleRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const refreshRole = async () => {
    setIsRefreshing(true);
    setStatus('idle');

    try {
      // Clear any cached auth data
      window.dispatchEvent(new CustomEvent('userLogin'));
      
      // Force auth context refresh
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if role is now correct
      const userStr = localStorage.getItem("lush_user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (expectedRole && userData.role === expectedRole) {
          setStatus('success');
          setTimeout(() => window.location.reload(), 500);
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const forceCorrectRole = () => {
    if (!expectedRole) return;
    
    // Force set the correct role
    const userStr = localStorage.getItem("lush_user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        userData.role = expectedRole;
        localStorage.setItem("lush_user", JSON.stringify(userData));
        window.dispatchEvent(new CustomEvent('userLogin'));
        setTimeout(() => window.location.reload(), 100);
      } catch (error) {
        console.error("Failed to fix role:", error);
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button
          onClick={refreshRole}
          disabled={isRefreshing}
          size={size}
          variant={variant}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Role'}
        </Button>
        
        {expectedRole && currentRole !== expectedRole && (
          <Button
            onClick={forceCorrectRole}
            size={size}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Fix Role
          </Button>
        )}
      </div>

      {status === 'success' && (
        <Alert className="mt-2 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Role refreshed successfully! Reloading page...
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="mt-2 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Role refresh failed. Try the "Fix Role" button or clear storage and re-login.
          </AlertDescription>
        </Alert>
      )}

      {currentRole && expectedRole && currentRole !== expectedRole && (
        <Alert className="mt-2 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            <strong>Role Mismatch:</strong> Expected "{expectedRole}" but detected "{currentRole}"
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RoleRefreshButton;