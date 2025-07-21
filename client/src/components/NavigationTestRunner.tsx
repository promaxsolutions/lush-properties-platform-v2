import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { getCurrentUserSession, performSecureLogin } from '@/utils/sessionManager';

interface TestResult {
  role: string;
  success: boolean;
  message: string;
  navigationItems: number;
}

const NavigationTestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUserSession());

  const testRoles = [
    { role: 'admin', email: 'admin@lush.com', name: 'Sarah Chen' },
    { role: 'builder', email: 'builder@lush.com', name: 'Mike Johnson' },
    { role: 'client', email: 'client@lush.com', name: 'Jennifer Williams' },
    { role: 'accountant', email: 'accountant@lush.com', name: 'Emma Davis' },
    { role: 'investor', email: 'investor@lush.com', name: 'Robert Kim' }
  ];

  const runNavigationTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const results: TestResult[] = [];

    for (const testRole of testRoles) {
      try {
        console.log(`🧪 Testing navigation for role: ${testRole.role}`);
        
        // Switch to test role
        await performSecureLogin({
          email: testRole.email,
          role: testRole.role,
          name: testRole.name
        });

        // Wait for navigation to update
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if navigation elements are properly rendered
        const navElements = document.querySelectorAll('[data-nav-item]');
        const validLinks = document.querySelectorAll('a[href]');
        
        results.push({
          role: testRole.role,
          success: navElements.length > 0 && validLinks.length > 0,
          message: `Found ${navElements.length} nav items, ${validLinks.length} valid links`,
          navigationItems: navElements.length
        });

        console.log(`✅ Navigation test completed for ${testRole.role}`);
        
      } catch (error) {
        console.error(`❌ Navigation test failed for ${testRole.role}:`, error);
        results.push({
          role: testRole.role,
          success: false,
          message: `Error: ${error.message}`,
          navigationItems: 0
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);
    setCurrentUser(getCurrentUserSession());
  };

  const resetToCurrentUser = async () => {
    if (currentUser) {
      await performSecureLogin({
        email: currentUser.email,
        role: currentUser.role,
        name: currentUser.name
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Navigation Test Runner</h3>
          <p className="text-sm text-gray-600">Test role-based navigation for all user types</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runNavigationTest}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
          {testResults.length > 0 && (
            <Button
              onClick={resetToCurrentUser}
              variant="outline"
              size="sm"
            >
              Reset to Current User
            </Button>
          )}
        </div>
      </div>

      {currentUser && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentUser.role}</Badge>
              <span>Current User: {currentUser.name} ({currentUser.email})</span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {testResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Test Results</h4>
          {testResults.map((result) => (
            <div
              key={result.role}
              className={`p-3 rounded-lg border ${
                result.success
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.role}
                  </Badge>
                  <span className="text-sm font-medium">
                    {result.navigationItems} nav items
                  </span>
                </div>
              </div>
              <p className={`text-xs mt-1 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <div>✅ Passed: {testResults.filter(r => r.success).length}</div>
              <div>❌ Failed: {testResults.filter(r => !r.success).length}</div>
              <div>📊 Total: {testResults.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationTestRunner;