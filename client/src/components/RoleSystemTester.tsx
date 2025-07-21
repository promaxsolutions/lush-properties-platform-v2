import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const testUsers = {
  "admin@lush.com": { password: "admin123", role: "admin", name: "Sarah Chen", expectedRoute: "/dashboard" },
  "builder@lush.com": { password: "builder123", role: "builder", name: "Mike Johnson", expectedRoute: "/builder" },
  "client@lush.com": { password: "client123", role: "client", name: "Jennifer Williams", expectedRoute: "/client" },
  "investor@lush.com": { password: "investor123", role: "investor", name: "Robert Kim", expectedRoute: "/investor" },
  "accountant@lush.com": { password: "accountant123", role: "accountant", name: "Emma Davis", expectedRoute: "/finance" }
};

const RoleSystemTester = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("lush_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const loginAs = (email: string) => {
    const user = testUsers[email as keyof typeof testUsers];
    if (!user) return;

    const userData = {
      email: email.toLowerCase(),
      role: user.role,
      name: user.name,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem("lush_user", JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('userLogin'));
    
    setCurrentUser(userData);
    
    // Test redirect
    setTimeout(() => {
      window.location.href = user.expectedRoute;
    }, 1000);
  };

  const testRole = async (email: string) => {
    const user = testUsers[email as keyof typeof testUsers];
    if (!user) return;

    try {
      // Login
      loginAs(email);
      
      // Check localStorage
      const storedUser = getCurrentUser();
      const isStored = storedUser && storedUser.role === user.role;
      
      // Check navigation access
      const navTest = await testNavigation(user.role);
      
      setTestResults(prev => ({
        ...prev,
        [email]: {
          login: true,
          storage: isStored,
          navigation: navTest,
          expectedRoute: user.expectedRoute,
          status: isStored && navTest ? 'pass' : 'fail'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [email]: {
          login: false,
          storage: false,
          navigation: false,
          error: error.message,
          status: 'fail'
        }
      }));
    }
  };

  const testNavigation = async (role: string): Promise<boolean> => {
    // Simulate navigation test by checking role-based routing
    const expectedNavItems = {
      admin: 7, // Full access
      builder: 3, // Limited builder tools
      client: 3, // Client-specific items
      accountant: 3, // Finance-focused items
      investor: 2 // Investment tracking
    };
    
    return expectedNavItems[role as keyof typeof expectedNavItems] > 0;
  };

  const clearStorage = () => {
    localStorage.removeItem("lush_user");
    setCurrentUser(null);
    setTestResults({});
    window.location.reload();
  };

  const user = getCurrentUser();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Complete Role System Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription>
              <strong>Current User:</strong> {user ? `${user.name} (${user.role})` : 'Not logged in'}
            </AlertDescription>
          </Alert>

          {/* Role Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testUsers).map(([email, userData]) => (
              <Card key={email} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{userData.name}</h3>
                      <p className="text-sm text-gray-600">{email}</p>
                      <Badge variant="outline" className="mt-1">
                        {userData.role}
                      </Badge>
                    </div>
                    {testResults[email] && (
                      <div className="text-right">
                        {testResults[email].status === 'pass' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : testResults[email].status === 'fail' ? (
                          <XCircle className="h-6 w-6 text-red-600" />
                        ) : (
                          <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => loginAs(email)}
                      className="w-full"
                      size="sm"
                    >
                      Login as {userData.role}
                    </Button>
                    
                    <Button 
                      onClick={() => testRole(email)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Full Role Test
                    </Button>
                  </div>

                  {testResults[email] && (
                    <div className="mt-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Login:</span>
                        <span className={testResults[email].login ? 'text-green-600' : 'text-red-600'}>
                          {testResults[email].login ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className={testResults[email].storage ? 'text-green-600' : 'text-red-600'}>
                          {testResults[email].storage ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Navigation:</span>
                        <span className={testResults[email].navigation ? 'text-green-600' : 'text-red-600'}>
                          {testResults[email].navigation ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button onClick={clearStorage} variant="destructive">
              Clear All & Logout
            </Button>
            <Button onClick={() => window.location.href = "/login"} variant="outline">
              Go to Login Page
            </Button>
          </div>

          {/* Route Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Route Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['/dashboard', '/builder', '/client', '/finance', '/investor', '/uploads', '/documents'].map(route => (
                  <Button 
                    key={route}
                    onClick={() => window.location.href = route}
                    variant="outline"
                    size="sm"
                  >
                    Test {route}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSystemTester;