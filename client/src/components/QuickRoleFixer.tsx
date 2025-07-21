import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const QuickRoleFixer = () => {
  const forceBuilderLogin = () => {
    // Clear any existing user data
    localStorage.removeItem("lush_user");
    
    // Set proper builder user
    const builderUser = {
      email: "builder@lush.com",
      role: "builder",
      name: "Mike Johnson",
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("lush_user", JSON.stringify(builderUser));
    
    // Trigger auth context update
    window.dispatchEvent(new CustomEvent('userLogin'));
    
    // Redirect to builder dashboard
    setTimeout(() => {
      window.location.href = "/builder";
    }, 500);
  };

  const forceClientLogin = () => {
    localStorage.removeItem("lush_user");
    
    const clientUser = {
      email: "client@lush.com", 
      role: "client",
      name: "Jennifer Williams",
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("lush_user", JSON.stringify(clientUser));
    window.dispatchEvent(new CustomEvent('userLogin'));
    
    setTimeout(() => {
      window.location.href = "/client";
    }, 500);
  };

  const clearAndGoToLogin = () => {
    localStorage.removeItem("lush_user");
    window.location.href = "/login";
  };

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("lush_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Role Access Issue Detected:</strong> You're getting "access denied you are logged in as a client" when trying to access builder features.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Quick Role Fixer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Current User Status:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {user ? JSON.stringify(user, null, 2) : "No user logged in"}
            </pre>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Fix Builder Access:</h3>
              <Button 
                onClick={forceBuilderLogin}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Force Builder Login (builder@lush.com)
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Fix Client Access:</h3>
              <Button 
                onClick={forceClientLogin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Force Client Login (client@lush.com)
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Reset Everything:</h3>
              <Button 
                onClick={clearAndGoToLogin}
                variant="destructive"
                className="w-full"
              >
                Clear Storage & Go to Login
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Diagnostic Tools:</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.href = "/error-diagnostics"}
                variant="outline"
                size="sm"
              >
                Error Diagnostics
              </Button>
              <Button 
                onClick={() => window.location.href = "/role-system-test"}
                variant="outline"
                size="sm"
              >
                Role System Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickRoleFixer;