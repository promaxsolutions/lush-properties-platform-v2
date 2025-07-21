import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, PlayCircle, RefreshCw, Navigation } from 'lucide-react';
import { performSecureLogin, performSecureLogout, getCurrentUserSession } from '@/utils/sessionManager';

interface NavAuditResult {
  role: string;
  loginSuccess: boolean;
  redirectPath: string;
  expectedPath: string;
  navigationItems: {
    path: string;
    label: string;
    visible: boolean;
    clickable: boolean;
  }[];
  logoutClean: boolean;
  overallScore: number;
}

const NavigationAuditRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRole, setCurrentRole] = useState('');
  const [auditResults, setAuditResults] = useState<NavAuditResult[]>([]);

  const roleTestSpecs = [
    {
      role: 'admin',
      email: 'admin@lush.com',
      name: 'Sarah Chen',
      expectedPath: '/dashboard',
      expectedNavItems: [
        { path: '/dashboard', label: 'Admin Dashboard' },
        { path: '/builder', label: 'Builder Portal' },
        { path: '/client', label: 'Client Portal' },
        { path: '/finance', label: 'Finance Portal' },
        { path: '/investor', label: 'Investor Portal' },
        { path: '/users', label: 'Team Manager' },
        { path: '/security', label: 'Security' }
      ]
    },
    {
      role: 'builder',
      email: 'builder@lush.com',
      name: 'Mike Johnson',
      expectedPath: '/builder',
      expectedNavItems: [
        { path: '/builder', label: 'My Dashboard' },
        { path: '/uploads', label: 'Upload Progress' },
        { path: '/timeline', label: 'Project Timeline' }
      ]
    },
    {
      role: 'investor',
      email: 'investor@lush.com',
      name: 'Robert Kim',
      expectedPath: '/investor',
      expectedNavItems: [
        { path: '/investor', label: 'My Investments' },
        { path: '/documents', label: 'Investment Docs' }
      ]
    },
    {
      role: 'client',
      email: 'client@lush.com',
      name: 'Jennifer Williams',
      expectedPath: '/client',
      expectedNavItems: [
        { path: '/client', label: 'My Project' },
        { path: '/uploads', label: 'Project Progress' },
        { path: '/documents', label: 'My Documents' }
      ]
    },
    {
      role: 'accountant',
      email: 'accountant@lush.com',
      name: 'Emma Davis',
      expectedPath: '/finance',
      expectedNavItems: [
        { path: '/finance', label: 'Finance Dashboard' },
        { path: '/receipts', label: 'Receipt Management' },
        { path: '/claims', label: 'Payment Claims' }
      ]
    }
  ];

  const auditRoleNavigation = async (roleSpec: typeof roleTestSpecs[0]): Promise<NavAuditResult> => {
    console.log(`🧪 Starting navigation audit for ${roleSpec.role}`);
    setCurrentRole(roleSpec.role);

    let loginSuccess = false;
    let redirectPath = '';
    let navigationItems = [];
    let logoutClean = false;

    try {
      // Step 1: Login
      await performSecureLogin({
        email: roleSpec.email,
        role: roleSpec.role,
        name: roleSpec.name
      });

      // Step 2: Wait for navigation to settle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Check session
      const session = getCurrentUserSession();
      loginSuccess = session && session.role === roleSpec.role;
      redirectPath = window.location.pathname;

      // Step 4: Check navigation items
      for (const expectedItem of roleSpec.expectedNavItems) {
        const navElement = document.querySelector(`[data-nav-item="${expectedItem.path}"]`);
        const isVisible = navElement !== null;
        const isClickable = navElement && !navElement.classList.contains('disabled');

        navigationItems.push({
          path: expectedItem.path,
          label: expectedItem.label,
          visible: isVisible,
          clickable: isClickable
        });
      }

      // Step 5: Test logout
      performSecureLogout();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sessionAfterLogout = getCurrentUserSession();
      logoutClean = !sessionAfterLogout;

    } catch (error) {
      console.error(`❌ Navigation audit failed for ${roleSpec.role}:`, error);
    }

    // Calculate score
    const loginScore = loginSuccess ? 25 : 0;
    const redirectScore = (redirectPath === roleSpec.expectedPath) ? 25 : 0;
    const navScore = (navigationItems.filter(item => item.visible && item.clickable).length / navigationItems.length) * 25;
    const logoutScore = logoutClean ? 25 : 0;
    const overallScore = loginScore + redirectScore + navScore + logoutScore;

    return {
      role: roleSpec.role,
      loginSuccess,
      redirectPath,
      expectedPath: roleSpec.expectedPath,
      navigationItems,
      logoutClean,
      overallScore
    };
  };

  const runFullNavigationAudit = async () => {
    setIsRunning(true);
    setAuditResults([]);

    const results = [];
    for (const roleSpec of roleTestSpecs) {
      const auditResult = await auditRoleNavigation(roleSpec);
      results.push(auditResult);
      setAuditResults([...results]); // Update incrementally
    }

    setIsRunning(false);
    setCurrentRole('');
    console.log('🏁 Navigation audit completed');
  };

  const quickTestRole = async (role: string) => {
    const roleSpec = roleTestSpecs.find(spec => spec.role === role);
    if (roleSpec) {
      setIsRunning(true);
      const result = await auditRoleNavigation(roleSpec);
      setAuditResults([result]);
      setIsRunning(false);
    }
  };

  // Auto-start audit on component mount
  useEffect(() => {
    runFullNavigationAudit();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            🧪 Navigation Audit Runner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Comprehensive role-based navigation audit running automatically
              </p>
              {currentRole && (
                <div className="mt-2 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-600">Testing {currentRole} role...</span>
                </div>
              )}
            </div>
            <Button
              onClick={runFullNavigationAudit}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Re-run Audit
                </>
              )}
            </Button>
          </div>

          {/* Quick Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-medium">Quick Test:</span>
            {roleTestSpecs.map((spec) => (
              <Button
                key={spec.role}
                size="sm"
                variant="outline"
                onClick={() => quickTestRole(spec.role)}
                disabled={isRunning}
              >
                {spec.role}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {auditResults.map((result) => (
        <Card key={result.role}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Badge variant={result.overallScore >= 75 ? 'default' : 'destructive'}>
                  {result.role}
                </Badge>
                Navigation Test
              </CardTitle>
              <div className="text-right">
                <div className="text-2xl font-bold">{Math.round(result.overallScore)}%</div>
                <div className="text-xs text-gray-600">Overall Score</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-3 rounded-lg border ${result.loginSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {result.loginSuccess ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                  <span className="text-sm font-medium">Login</span>
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {result.loginSuccess ? 'Success' : 'Failed'}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${result.redirectPath === result.expectedPath ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {result.redirectPath === result.expectedPath ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                  <span className="text-sm font-medium">Redirect</span>
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {result.redirectPath} {result.redirectPath === result.expectedPath ? '✅' : '❌'}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${result.navigationItems.every(item => item.visible) ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {result.navigationItems.every(item => item.visible) ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                  <span className="text-sm font-medium">Navigation</span>
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {result.navigationItems.filter(item => item.visible).length}/{result.navigationItems.length} visible
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${result.logoutClean ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {result.logoutClean ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                  <span className="text-sm font-medium">Logout</span>
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {result.logoutClean ? 'Clean' : 'Issues'}
                </div>
              </div>
            </div>

            {/* Navigation Items Detail */}
            <div>
              <h4 className="font-medium mb-2">Navigation Items</h4>
              <div className="grid gap-2">
                {result.navigationItems.map((item) => (
                  <div
                    key={item.path}
                    className={`p-2 rounded border text-sm ${
                      item.visible && item.clickable
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{item.path}</Badge>
                        {item.visible && item.clickable ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      {auditResults.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{auditResults.filter(r => r.loginSuccess).length}/{auditResults.length}</div>
                <div className="text-xs">Login Success</div>
              </div>
              <div>
                <div className="text-lg font-bold">{auditResults.filter(r => r.redirectPath === r.expectedPath).length}/{auditResults.length}</div>
                <div className="text-xs">Correct Redirects</div>
              </div>
              <div>
                <div className="text-lg font-bold">{Math.round(auditResults.reduce((acc, r) => acc + r.overallScore, 0) / auditResults.length)}%</div>
                <div className="text-xs">Average Score</div>
              </div>
              <div>
                <div className="text-lg font-bold">{auditResults.filter(r => r.logoutClean).length}/{auditResults.length}</div>
                <div className="text-xs">Clean Logouts</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NavigationAuditRunner;