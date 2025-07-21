import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BuilderDebugTest = () => {
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("lush_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const testBuilderLogin = () => {
    const testUser = {
      email: "builder@lush.com",
      role: "builder",
      name: "Mike Johnson",
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("lush_user", JSON.stringify(testUser));
    window.location.href = "/builder";
  };

  const clearStorage = () => {
    localStorage.removeItem("lush_user");
    window.location.reload();
  };

  const user = getCurrentUser();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Builder Login Debug Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Current User Status:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {user ? JSON.stringify(user, null, 2) : "No user logged in"}
            </pre>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={testBuilderLogin} className="bg-blue-600 hover:bg-blue-700">
              Force Builder Login
            </Button>
            <Button onClick={clearStorage} variant="outline">
              Clear Storage
            </Button>
            <Button onClick={() => window.location.href = "/login"} variant="outline">
              Go to Login Page
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Test Routes:</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = "/builder"}
                variant="outline" 
                className="w-full justify-start"
              >
                Test /builder route
              </Button>
              <Button 
                onClick={() => window.location.href = "/uploads"}
                variant="outline" 
                className="w-full justify-start"
              >
                Test /uploads route
              </Button>
              <Button 
                onClick={() => window.location.href = "/timeline"}
                variant="outline" 
                className="w-full justify-start"
              >
                Test /timeline route
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuilderDebugTest;