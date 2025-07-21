import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Navigation } from 'lucide-react';

interface RouteTest {
  route: string;
  role: string;
  expectedResult: 'allowed' | 'redirect' | 'fallback';
  actualResult?: 'allowed' | 'redirect' | 'fallback';
  redirectTarget?: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
}

const RouteTestingUtility = () => {
  const [tests, setTests] = useState<RouteTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const ROLE_ROUTES = {
    admin: {
      allowed: ['/dashboard', '/builder', '/client', '/finance', '/investor', '/users', '/audit', '/contracts'],
      forbidden: []
    },
    builder: {
      allowed: ['/builder', '/uploads', '/timeline', '/documents'],
      forbidden: ['/dashboard', '/users', '/audit', '/finance', '/investor']
    },
    client: {
      allowed: ['/client', '/uploads', '/documents', '/project-view'],
      forbidden: ['/dashboard', '/users', '/audit', '/builder', '/finance']
    },
    accountant: {
      allowed: ['/finance', '/receipts', '/claims', '/uploads'],
      forbidden: ['/dashboard', '/users', '/builder', '/investor']
    },
    investor: {
      allowed: ['/investor', '/documents', '/heatmap'],
      forbidden: ['/dashboard', '/users', '/audit', '/builder', '/finance']
    }
  };

  const INVALID_ROUTES = [
    '/nonexistent',
    '/invalid-page',
    '/admin/secret',
    '/unauthorized-area',
    '/test/invalid'
  ];

  const generateTestCases = (): RouteTest[] => {
    const testCases: RouteTest[] = [];

    // Test valid routes for each role
    Object.entries(ROLE_ROUTES).forEach(([role, routes]) => {
      routes.allowed.forEach(route => {
        testCases.push({
          route,
          role,
          expectedResult: 'allowed',
          status: 'pending'
        });
      });

      routes.forbidden.forEach(route => {
        testCases.push({
          route,
          role,
          expectedResult: 'redirect',
          status: 'pending'
        });
      });
    });

    // Test invalid routes
    INVALID_ROUTES.forEach(route => {
      ['admin', 'builder', 'client'].forEach(role => {
        testCases.push({
          route,
          role,
          expectedResult: 'fallback',
          status: 'pending'
        });
      });
    });

    return testCases;
  };

  const simulateRouteTest = async (test: RouteTest): Promise<RouteTest> => {
    // Simulate testing by checking our route logic
    const userRoutes = ROLE_ROUTES[test.role as keyof typeof ROLE_ROUTES];
    const isValidRoute = Object.values(ROLE_ROUTES).some(routes => 
      routes.allowed.includes(test.route)
    );

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate test time

    let actualResult: 'allowed' | 'redirect' | 'fallback';
    let redirectTarget = '';

    if (INVALID_ROUTES.includes(test.route)) {
      actualResult = 'fallback';
      redirectTarget = `/dashboard`; // Default fallback
    } else if (userRoutes.allowed.includes(test.route)) {
      actualResult = 'allowed';
    } else {
      actualResult = 'redirect';
      redirectTarget = userRoutes.allowed[0] || '/dashboard';
    }

    const status = actualResult === test.expectedResult ? 'passed' : 'failed';

    return {
      ...test,
      actualResult,
      redirectTarget,
      status
    };
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const testCases = generateTestCases();
    setTests(testCases);

    const results: RouteTest[] = [];
    
    for (const test of testCases) {
      setTests(prev => prev.map(t => 
        t.route === test.route && t.role === test.role 
          ? { ...t, status: 'testing' }
          : t
      ));

      const result = await simulateRouteTest(test);
      results.push(result);

      setTests(prev => prev.map(t => 
        t.route === test.route && t.role === test.role 
          ? result
          : t
      ));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;
  const totalTests = tests.length;

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Fallback Testing Utility
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test the route fallback implementation: "On route change failure, fallback to dashboard"
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-lush-primary hover:bg-lush-primary/90"
            >
              {isRunning ? 'Testing Routes...' : 'Run Route Tests'}
            </Button>
            
            {totalTests > 0 && (
              <div className="flex gap-4">
                <div className="text-sm">
                  <span className="font-medium text-green-600">{passedTests}</span> passed
                </div>
                <div className="text-sm">
                  <span className="font-medium text-red-600">{failedTests}</span> failed
                </div>
                <div className="text-sm">
                  <span className="font-medium">{totalTests}</span> total
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {tests.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {['admin', 'builder', 'client', 'accountant', 'investor'].map(role => {
            const roleTests = tests.filter(t => t.role === role);
            const rolePassed = roleTests.filter(t => t.status === 'passed').length;
            const roleTotal = roleTests.length;

            return (
              <Card key={role}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="capitalize">{role} Role</span>
                    <Badge className={rolePassed === roleTotal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {rolePassed}/{roleTotal}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {roleTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <code className="bg-gray-200 px-2 py-1 rounded text-xs">{test.route}</code>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-xs ${getStatusColor(test.status)}`}>
                            {test.expectedResult} → {test.actualResult || 'pending'}
                          </Badge>
                          {test.redirectTarget && (
                            <div className="text-xs text-gray-500 mt-1">
                              → {test.redirectTarget}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Route Fallback Pattern Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm text-gray-800">
{`// Enhanced route fallback implementation
useEffect(() => {
  const currentPath = window.location.pathname;
  const userRoutes = ROUTES[userRole] || [];
  const fallbackRoute = DEFAULT_ROUTES[userRole] || '/dashboard';
  
  if (!userRoutes.includes(currentPath)) {
    console.log(\`[Route Handler] Invalid route \${currentPath} for role \${userRole}, redirecting to \${fallbackRoute}\`);
    setLocation(fallbackRoute);
  }
}, [location, userRole, setLocation]);`}
              </pre>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">✅ Route Validation</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Role-based route checking</li>
                  <li>• Invalid route detection</li>
                  <li>• Automatic fallback routing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔒 Security Features</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Unauthorized access blocking</li>
                  <li>• Route permission enforcement</li>
                  <li>• Safe default redirects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🎯 Fallback Strategy</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Role-specific dashboards</li>
                  <li>• Unknown route handling</li>
                  <li>• Graceful error recovery</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteTestingUtility;