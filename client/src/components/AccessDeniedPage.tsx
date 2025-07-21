import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Home, LogOut } from 'lucide-react';
import { getCurrentUserSession, performSecureLogout } from '@/utils/sessionManager';
import FlashMessage from './FlashMessage';

interface AccessDeniedPageProps {
  requiredRole?: string;
  currentPath?: string;
}

const AccessDeniedPage = ({ requiredRole, currentPath }: AccessDeniedPageProps) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUserSession();

  const handleGoHome = () => {
    if (currentUser) {
      const dashboards = {
        admin: '/dashboard',
        builder: '/builder',
        client: '/client',
        accountant: '/finance',
        investor: '/investor'
      };
      
      const targetDashboard = dashboards[currentUser.role] || '/dashboard';
      navigate(targetDashboard);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    performSecureLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        {/* Flash Message */}
        <div className="mb-6">
          <FlashMessage
            type="error"
            message={`Access denied${requiredRole ? ` - requires ${requiredRole} role` : ''}`}
            autoClose={false}
          />
        </div>

        {/* User Info */}
        {currentUser && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-1">
                <div><strong>Current User:</strong> {currentUser.name}</div>
                <div><strong>Role:</strong> {currentUser.role}</div>
                <div><strong>Email:</strong> {currentUser.email}</div>
                {currentPath && <div><strong>Attempted Path:</strong> {currentPath}</div>}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleGoHome}
            className="w-full bg-lush-primary hover:bg-lush-primary/90"
            size="lg"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to My Dashboard
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Go Back
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
            size="lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout & Switch User
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need access? Contact your administrator.</p>
          <p className="mt-2 font-medium">Lush Properties Pty Ltd</p>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;