import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Home, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  userRole?: string;
  requireAuth?: boolean;
}

const RouteGuard = ({ children, allowedRoles, userRole, requireAuth = true }: RouteGuardProps) => {
  const [, setLocation] = useLocation();

  // If authentication is required but no user role is provided
  if (requireAuth && !userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              You must be logged in to access this page.
            </p>
            <Button 
              onClick={() => setLocation('/login')}
              className="w-full bg-lush-primary hover:bg-lush-primary/90"
            >
              <Shield className="h-4 w-4 mr-2" />
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user role is not in allowed roles
  if (userRole && !allowedRoles.includes(userRole)) {
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

    const getRoleDisplayName = (role: string): string => {
      switch (role) {
        case 'admin': return 'Administrator';
        case 'builder': return 'Builder';
        case 'client': return 'Client';
        case 'accountant': return 'Accountant';
        case 'investor': return 'Investor';
        default: return 'User';
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-2">
              This page is not available for your role.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You are logged in as: <span className="font-medium">{getRoleDisplayName(userRole)}</span>
            </p>
            
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
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
};

export default RouteGuard;