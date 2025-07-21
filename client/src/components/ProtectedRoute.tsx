import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  userRole?: string;
  redirectTo?: string;
}

interface RoutePermissions {
  [key: string]: string[];
}

// Define which roles can access which routes
const routePermissions: RoutePermissions = {
  '/dashboard': ['admin'],
  '/users': ['admin'],
  '/security': ['admin'],
  '/walkthrough': ['admin'],
  
  '/builder': ['builder', 'admin'],
  '/uploads': ['builder', 'admin'],
  '/timeline': ['builder', 'admin'],
  '/claims': ['builder', 'admin'],
  
  '/client': ['client', 'admin'],
  '/client-portal': ['client', 'admin'],
  '/client-upgrades': ['client', 'admin'],
  '/messages': ['client', 'admin'],
  
  '/finance': ['accountant', 'admin'],
  '/receipts': ['accountant', 'admin'],
  '/xero-sync': ['accountant', 'admin'],
  
  '/investor': ['investor', 'admin'],
  '/investor-portal': ['investor', 'admin'],
  '/documents': ['investor', 'admin', 'client'],
  '/heatmap': ['investor', 'admin']
};

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  userRole = 'guest',
  redirectTo
}: ProtectedRouteProps) => {
  const [location, setLocation] = useLocation();

  // Check if current route has specific role requirements
  const currentRouteRoles = routePermissions[location];
  const effectiveAllowedRoles = currentRouteRoles || allowedRoles;

  const hasAccess = effectiveAllowedRoles.includes(userRole);

  useEffect(() => {
    if (!hasAccess && redirectTo) {
      // Auto-redirect to appropriate dashboard based on role
      const getRoleRedirect = (role: string) => {
        switch (role) {
          case 'admin': return '/dashboard';
          case 'builder': return '/builder';
          case 'client': return '/client';
          case 'accountant': return '/finance';
          case 'investor': return '/investor-portal';
          default: return '/login';
        }
      };

      const redirectPath = redirectTo === 'auto' ? getRoleRedirect(userRole) : redirectTo;
      setLocation(redirectPath);
    }
  }, [hasAccess, redirectTo, userRole, setLocation]);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldX className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Restricted
            </h2>
            
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Your role ({userRole}) is not authorized for this section.
            </p>

            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-800">
                <strong>Required Access:</strong> {effectiveAllowedRoles.join(', ')}
                <br />
                <strong>Your Role:</strong> {userRole}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={() => setLocation(getRoleDashboard(userRole))}
                className="w-full bg-lush-primary hover:bg-lush-primary/90"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to My Dashboard
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              If you believe this is an error, please contact your administrator.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Helper function to get role-specific dashboard
const getRoleDashboard = (role: string): string => {
  switch (role) {
    case 'admin': return '/dashboard';
    case 'builder': return '/builder';
    case 'client': return '/client';
    case 'accountant': return '/finance';
    case 'investor': return '/investor';
    default: return '/login';
  }
};

export default ProtectedRoute;