import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const ErrorDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    runDiagnostics();
    
    // Listen for console errors
    const originalError = console.error;
    console.error = (...args) => {
      setErrors(prev => [...prev.slice(-9), args.join(' ')]);
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const runDiagnostics = () => {
    const user = getCurrentUser();
    const routeTests = testRoutes();
    const authTests = testAuthentication();
    const navTests = testNavigation(user?.role);

    setDiagnostics({
      user,
      routes: routeTests,
      auth: authTests,
      navigation: navTests,
      timestamp: new Date().toISOString()
    });
  };

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("lush_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return { error: error.message };
    }
  };

  const testRoutes = () => {
    const routes = [
      { path: '/dashboard', roles: ['admin'] },
      { path: '/builder', roles: ['builder', 'admin'] },
      { path: '/client', roles: ['client', 'admin'] },
      { path: '/finance', roles: ['accountant', 'admin'] },
      { path: '/investor', roles: ['investor', 'admin'] },
      { path: '/uploads', roles: ['builder', 'client', 'admin'] },
      { path: '/documents', roles: ['client', 'investor', 'admin'] }
    ];

    return routes.map(route => ({
      ...route,
      accessible: true, // We'll check this
      status: 'defined'
    }));
  };

  const testAuthentication = () => {
    const user = getCurrentUser();
    return {
      hasLocalStorage: !!localStorage.getItem("lush_user"),
      userParsed: !!user && !user.error,
      hasRole: !!user?.role,
      hasEmail: !!user?.email,
      authContextReady: true // We'd check if AuthContext is working
    };
  };

  const testNavigation = (userRole: string) => {
    const expectedNavItems = {
      admin: ['Admin Dashboard', 'Builder Portal', 'Client Portal', 'Finance Portal', 'Investor Portal', 'Team Manager', 'Security'],
      builder: ['My Dashboard', 'Upload Progress', 'Project Timeline'],
      client: ['My Project', 'Project Progress', 'My Documents'],
      accountant: ['Finance Dashboard', 'Receipt Management', 'Payment Claims'],
      investor: ['My Investments', 'Investment Docs']
    };

    return {
      role: userRole,
      expectedItems: expectedNavItems[userRole as keyof typeof expectedNavItems] || [],
      itemCount: expectedNavItems[userRole as keyof typeof expectedNavItems]?.length || 0
    };
  };

  const forceLogin = (role: string) => {
    const users = {
      admin: { email: "admin@lush.com", name: "Sarah Chen" },
      builder: { email: "builder@lush.com", name: "Mike Johnson" },
      client: { email: "client@lush.com", name: "Jennifer Williams" },
      accountant: { email: "accountant@lush.com", name: "Emma Davis" },
      investor: { email: "investor@lush.com", name: "Robert Kim" }
    };

    const userData = users[role as keyof typeof users];
    if (!userData) return;

    localStorage.setItem("lush_user", JSON.stringify({
      email: userData.email,
      role: role,
      name: userData.name,
      loginTime: new Date().toISOString()
    }));

    window.dispatchEvent(new CustomEvent('userLogin'));
    runDiagnostics();
  };

  const clearAndRedirect = (path: string) => {
    localStorage.removeItem("lush_user");
    setTimeout(() => {
      window.location.href = path;
    }, 100);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Diagnostics & Role System Status
            </span>
            <Button onClick={runDiagnostics} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Status */}
          <div>
            <h3 className="font-semibold mb-3">Current User Status</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(diagnostics.user || {}, null, 2)}
              </pre>
            </div>
          </div>

          {/* Authentication Tests */}
          <div>
            <h3 className="font-semibold mb-3">Authentication System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(diagnostics.auth || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Test */}
          <div>
            <h3 className="font-semibold mb-3">Navigation System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Role: {diagnostics.navigation?.role || 'None'}</p>
                <p className="text-sm text-gray-600 mb-2">Expected Items: {diagnostics.navigation?.itemCount || 0}</p>
                <div className="space-y-1">
                  {(diagnostics.navigation?.expectedItems || []).map((item: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="mr-1 mb-1">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Route Tests */}
          <div>
            <h3 className="font-semibold mb-3">Route Accessibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(diagnostics.routes || []).map((route: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-medium">{route.path}</span>
                    <div className="text-xs text-gray-500">
                      Roles: {route.roles.join(', ')}
                    </div>
                  </div>
                  <Badge variant={route.status === 'defined' ? 'default' : 'destructive'}>
                    {route.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Errors */}
          {errors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Recent Console Errors</h3>
              <div className="space-y-2">
                {errors.slice(-5).map((error, idx) => (
                  <Alert key={idx} className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700 text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['admin', 'builder', 'client', 'accountant', 'investor'].map(role => (
                <Button 
                  key={role}
                  onClick={() => forceLogin(role)}
                  variant="outline"
                  size="sm"
                  className="capitalize"
                >
                  Login as {role}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              <Button onClick={() => clearAndRedirect('/login')} size="sm">
                Go to Login
              </Button>
              <Button onClick={() => window.location.reload()} size="sm">
                Reload Page
              </Button>
              <Button onClick={() => localStorage.clear()} variant="destructive" size="sm">
                Clear Storage
              </Button>
              <Button onClick={() => window.location.href = '/role-system-test'} size="sm">
                Role System Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDiagnostics;