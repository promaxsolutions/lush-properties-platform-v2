import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { getCurrentUserSession } from '@/utils/sessionManager';

interface EnhancedRouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requireAuth?: boolean;
}

const EnhancedRouteGuard = ({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: EnhancedRouteGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessDeniedReason, setAccessDeniedReason] = useState<string>('');

  useEffect(() => {
    const checkAccess = () => {
      setIsChecking(true);
      
      try {
        // Get current user session
        const currentUser = getCurrentUserSession();
        setUser(currentUser);
        
        // Check if authentication is required
        if (requireAuth && !currentUser) {
          setAccessDeniedReason('Authentication required');
          setHasAccess(false);
          setIsChecking(false);
          
          // Redirect to login after short delay
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }
        
        // Check role permissions
        if (currentUser && allowedRoles.length > 0) {
          const userRole = currentUser.role;
          const hasRoleAccess = allowedRoles.includes(userRole);
          
          if (!hasRoleAccess) {
            setAccessDeniedReason(`Access restricted to: ${allowedRoles.join(', ')}`);
            setHasAccess(false);
            setIsChecking(false);
            
            // Redirect to user's correct dashboard
            const dashboards = {
              admin: '/dashboard',
              builder: '/builder',
              client: '/client',
              accountant: '/finance',
              investor: '/investor'
            };
            
            const correctDashboard = dashboards[userRole] || '/dashboard';
            
            setTimeout(() => {
              navigate(correctDashboard, { replace: true });
            }, 2000);
            return;
          }
        }
        
        // All checks passed
        setHasAccess(true);
        setIsChecking(false);
        
      } catch (error) {
        console.error('[ROUTE-GUARD] Access check failed:', error);
        setAccessDeniedReason('Session validation failed');
        setHasAccess(false);
        setIsChecking(false);
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };
    
    // Initial check
    checkAccess();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      checkAccess();
    };
    
    window.addEventListener('userLogin', handleAuthChange);
    window.addEventListener('userLogout', handleAuthChange);
    window.addEventListener('roleChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('userLogin', handleAuthChange);
      window.removeEventListener('userLogout', handleAuthChange);
      window.removeEventListener('roleChange', handleAuthChange);
    };
  }, [allowedRoles, requireAuth, navigate, location.pathname]);

  // Loading state
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-lush-primary" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Checking Access</h3>
            <p className="text-sm text-gray-600">Validating your permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Access Restricted</h4>
                  <p className="text-sm mt-1">{accessDeniedReason}</p>
                </div>
                
                {user && (
                  <div className="text-xs bg-red-100 p-2 rounded border">
                    <div><strong>Current User:</strong> {user.name}</div>
                    <div><strong>Role:</strong> {user.role}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/login')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Go to Login
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Access granted - render children
  return <>{children}</>;
};

export default EnhancedRouteGuard;