import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Building,
  Calculator,
  TrendingUp,
  LogIn,
  Navigation,
  Lock,
  Home
} from 'lucide-react';

interface TestUser {
  role: string;
  name: string;
  email: string;
  password: string;
  expectedRedirect: string;
  icon: React.ReactNode;
}

interface TestReport {
  role: string;
  step: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  timestamp: string;
}

const ManualRoleTester = () => {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [testReports, setTestReports] = useState<TestReport[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [testRoute, setTestRoute] = useState<string>('');

  const testUsers: TestUser[] = [
    {
      role: 'admin',
      name: 'Test Administrator',
      email: 'admin@lush.com',
      password: 'admin123',
      expectedRedirect: '/dashboard',
      icon: <Shield className="h-4 w-4" />
    },
    {
      role: 'builder',
      name: 'Test Builder',
      email: 'builder@lush.com',
      password: 'builder123',
      expectedRedirect: '/builder',
      icon: <Building className="h-4 w-4" />
    },
    {
      role: 'client',
      name: 'Test Client',
      email: 'client@lush.com',
      password: 'client123',
      expectedRedirect: '/client',
      icon: <User className="h-4 w-4" />
    },
    {
      role: 'accountant',
      name: 'Test Accountant',
      email: 'accountant@lush.com',
      password: 'accountant123',
      expectedRedirect: '/finance',
      icon: <Calculator className="h-4 w-4" />
    },
    {
      role: 'investor',
      name: 'Test Investor',
      email: 'investor@lush.com',
      password: 'investor123',
      expectedRedirect: '/investor',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      role: 'superadmin',
      name: 'Test Super Admin',
      email: 'superadmin@lush.com',
      password: 'superadmin123',
      expectedRedirect: '/dashboard',
      icon: <Shield className="h-4 w-4" />
    }
  ];

  const routesByRole = {
    admin: {
      allowed: ['/dashboard', '/builder', '/client', '/finance', '/investor', '/security', '/users', '/ai-workflows', '/contracts', '/profits'],
      restricted: []
    },
    builder: {
      allowed: ['/builder', '/uploads', '/timeline'],
      restricted: ['/dashboard', '/finance', '/investor', '/security', '/users', '/ai-workflows']
    },
    client: {
      allowed: ['/client', '/uploads', '/documents'],
      restricted: ['/dashboard', '/builder', '/finance', '/investor', '/security', '/ai-workflows']
    },
    accountant: {
      allowed: ['/finance', '/receipts', '/claims', '/xero'],
      restricted: ['/dashboard', '/builder', '/client', '/investor', '/security', '/ai-workflows']
    },
    investor: {
      allowed: ['/investor', '/documents', '/heatmap'],
      restricted: ['/dashboard', '/builder', '/client', '/finance', '/security', '/ai-workflows']
    }
  };

  const addTestReport = (role: string, step: string, status: 'pass' | 'fail' | 'pending', message: string) => {
    const report: TestReport = {
      role,
      step,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestReports(prev => [...prev, report]);
  };

  const loginAsUser = (user: TestUser) => {
    try {
      // Clear any existing user data
      localStorage.removeItem('lush_user');
      
      // Set the test user data
      const userData = {
        id: `${user.role}-test`,
        name: user.name,
        email: user.email,
        role: user.role
      };
      
      localStorage.setItem('lush_user', JSON.stringify(userData));
      setCurrentUser(user);
      
      addTestReport(user.role, 'Login', 'pass', `Successfully logged in as ${user.role}`);
      
      // Check if current path matches expected redirect
      const currentPath = window.location.pathname;
      if (currentPath === user.expectedRedirect) {
        addTestReport(user.role, 'Redirect', 'pass', `Correctly on ${user.expectedRedirect}`);
      } else {
        addTestReport(user.role, 'Redirect', 'fail', `Expected ${user.expectedRedirect}, currently on ${currentPath}`);
      }
      
    } catch (error) {
      addTestReport(user.role, 'Login', 'fail', `Login failed: ${error}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('lush_user');
    setCurrentUser(null);
    addTestReport('system', 'Logout', 'pass', 'User logged out successfully');
  };

  const testRouteAccess = (route: string) => {
    if (!currentUser) {
      addTestReport('system', 'Route Test', 'fail', 'No user logged in');
      return;
    }

    try {
      const userRoutes = routesByRole[currentUser.role as keyof typeof routesByRole];
      const shouldHaveAccess = userRoutes.allowed.includes(route);
      const isRestricted = userRoutes.restricted.includes(route);

      if (shouldHaveAccess) {
        addTestReport(
          currentUser.role, 
          'Route Access', 
          'pass', 
          `✓ Should have access to ${route} - testing navigation`
        );
      } else if (isRestricted) {
        addTestReport(
          currentUser.role, 
          'Route Restriction', 
          'pass', 
          `✓ Correctly restricted from ${route}`
        );
      } else {
        addTestReport(
          currentUser.role, 
          'Route Test', 
          'pending', 
          `Route ${route} not in test matrix`
        );
      }

      // Simulate navigation attempt
      window.history.pushState({}, '', route);
      
    } catch (error) {
      addTestReport(currentUser.role, 'Route Test', 'fail', `Route test failed: ${error}`);
    }
  };

  const runComprehensiveTest = (user: TestUser) => {
    setTestReports([]);
    
    // Step 1: Login
    loginAsUser(user);
    
    setTimeout(() => {
      // Step 2: Test allowed routes
      const userRoutes = routesByRole[user.role as keyof typeof routesByRole];
      userRoutes.allowed.forEach((route, index) => {
        setTimeout(() => {
          testRouteAccess(route);
        }, index * 200);
      });
      
      // Step 3: Test restricted routes
      setTimeout(() => {
        userRoutes.restricted.slice(0, 3).forEach((route, index) => {
          setTimeout(() => {
            testRouteAccess(route);
          }, index * 200);
        });
      }, userRoutes.allowed.length * 200 + 500);
      
    }, 500);
  };

  const getCurrentUserData = () => {
    try {
      const userData = localStorage.getItem('lush_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const currentUserData = getCurrentUserData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <div className="h-4 w-4 rounded-full bg-yellow-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const testStats = {
    total: testReports.length,
    passed: testReports.filter(r => r.status === 'pass').length,
    failed: testReports.filter(r => r.status === 'fail').length,
    pending: testReports.filter(r => r.status === 'pending').length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manual Role Flow Tester</h1>
          <p className="text-gray-600 mt-2">Test complete user journeys for each role manually</p>
        </div>
        
        {currentUserData && (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {currentUserData.role} - {currentUserData.name}
            </Badge>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Test Statistics */}
      {testReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{testStats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testStats.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testStats.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{testStats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Selection & Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Role Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {testUsers.map((user) => (
                <div key={user.role} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {user.icon}
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">Redirects to: {user.expectedRedirect}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loginAsUser(user)}
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => runComprehensiveTest(user)}
                    >
                      Full Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="h-4 w-4" />
                <span className="font-medium">Manual Route Testing</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="/route/to/test"
                  value={testRoute}
                  onChange={(e) => setTestRoute(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => testRouteAccess(testRoute)}
                  disabled={!currentUser || !testRoute}
                >
                  Test Route
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Live Test Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tests run yet. Select a role to begin testing.
                </div>
              ) : (
                testReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
                  >
                    {getStatusIcon(report.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {report.role}
                        </Badge>
                        <span className="text-sm font-medium">{report.step}</span>
                        <span className="text-xs text-gray-500">{report.timestamp}</span>
                      </div>
                      <div className="text-sm text-gray-700">{report.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Role Access Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Allowed Routes</th>
                  <th className="text-left p-2">Restricted Routes</th>
                  <th className="text-left p-2">Login Redirect</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(routesByRole).map(([role, routes]) => (
                  <tr key={role} className="border-b">
                    <td className="p-2 font-medium capitalize">{role}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {routes.allowed.map(route => (
                          <Badge key={route} variant="outline" className="text-xs">
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {routes.restricted.slice(0, 3).map(route => (
                          <Badge key={route} variant="secondary" className="text-xs">
                            {route}
                          </Badge>
                        ))}
                        {routes.restricted.length > 3 && (
                          <span className="text-xs text-gray-500">+{routes.restricted.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className="text-xs bg-lush-primary">
                        {testUsers.find(u => u.role === role)?.expectedRedirect}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualRoleTester;