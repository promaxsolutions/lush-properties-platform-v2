import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, CheckCircle, AlertTriangle, User, RefreshCw } from 'lucide-react';
import { performSecureLogin, getCurrentUserSession } from '@/utils/sessionManager';
import NavigationTestRunner from './NavigationTestRunner';
import RouteValidator from './RouteValidator';

interface LoginTestResult {
  role: string;
  email: string;
  name: string;
  success: boolean;
  navigationCount: number;
  redirectSuccess: boolean;
  error?: string;
}

const LoginTestSuite = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<LoginTestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const testUsers = [
    { role: 'admin', email: 'admin@lush.com', name: 'Sarah Chen' },
    { role: 'builder', email: 'builder@lush.com', name: 'Mike Johnson' },
    { role: 'client', email: 'client@lush.com', name: 'Jennifer Williams' },
    { role: 'accountant', email: 'accountant@lush.com', name: 'Emma Davis' },
    { role: 'investor', email: 'investor@lush.com', name: 'Robert Kim' }
  ];

  const runLoginTestSuite = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const results: LoginTestResult[] = [];

    for (const testUser of testUsers) {
      setCurrentTest(`Testing ${testUser.role} login...`);
      
      try {
        // Test login
        await performSecureLogin({
          email: testUser.email,
          role: testUser.role,
          name: testUser.name
        });

        // Wait for navigation to settle
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if session is properly set
        const currentUser = getCurrentUserSession();
        const sessionValid = currentUser && currentUser.role === testUser.role;

        // Check navigation items
        const navItems = document.querySelectorAll('[data-nav-item]');
        const navigationCount = navItems.length;

        // Check if we're on the correct dashboard
        const expectedPaths = {
          admin: '/dashboard',
          builder: '/builder', 
          client: '/client',
          accountant: '/finance',
          investor: '/investor'
        };

        const currentPath = window.location.pathname;
        const expectedPath = expectedPaths[testUser.role];
        const redirectSuccess = currentPath === expectedPath;

        results.push({
          role: testUser.role,
          email: testUser.email,
          name: testUser.name,
          success: sessionValid && navigationCount > 0,
          navigationCount,
          redirectSuccess,
          error: sessionValid ? undefined : 'Session validation failed'
        });

        console.log(`✅ Login test completed for ${testUser.role}`);

      } catch (error) {
        console.error(`❌ Login test failed for ${testUser.role}:`, error);
        
        results.push({
          role: testUser.role,
          email: testUser.email,
          name: testUser.name,
          success: false,
          navigationCount: 0,
          redirectSuccess: false,
          error: error.message || 'Unknown error'
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');
  };

  const quickSwitchTest = async (role: string) => {
    const testUser = testUsers.find(u => u.role === role);
    if (testUser) {
      await performSecureLogin({
        email: testUser.email,
        role: testUser.role,
        name: testUser.name
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Login & Navigation Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Test login functionality and role-based navigation for all user types
              </p>
              {currentTest && (
                <div className="mt-2 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-600">{currentTest}</span>
                </div>
              )}
            </div>
            <Button
              onClick={runLoginTestSuite}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Run Full Test Suite
                </>
              )}
            </Button>
          </div>

          {/* Quick Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-medium">Quick Switch:</span>
            {testUsers.map((user) => (
              <Button
                key={user.role}
                size="sm"
                variant="outline"
                onClick={() => quickSwitchTest(user.role)}
                disabled={isRunning}
              >
                {user.role}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result) => (
                <div
                  key={result.role}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.role}
                          </Badge>
                          <span className="font-medium">{result.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{result.email}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Navigation: {result.navigationCount} items</div>
                      <div className={result.redirectSuccess ? 'text-green-600' : 'text-red-600'}>
                        Redirect: {result.redirectSuccess ? 'Success' : 'Failed'}
                      </div>
                    </div>
                  </div>
                  {result.error && (
                    <div className="mt-2 text-sm text-red-700 bg-red-100 p-2 rounded">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <div className="text-sm space-y-1">
                  <div><strong>Passed:</strong> {testResults.filter(r => r.success).length}/{testResults.length}</div>
                  <div><strong>Average Navigation Items:</strong> {Math.round(testResults.reduce((acc, r) => acc + r.navigationCount, 0) / testResults.length)}</div>
                  <div><strong>Redirect Success Rate:</strong> {Math.round((testResults.filter(r => r.redirectSuccess).length / testResults.length) * 100)}%</div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Additional Test Components */}
      <NavigationTestRunner />
      <RouteValidator />
    </div>
  );
};

export default LoginTestSuite;