import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, PlayCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { performSecureLogin, performSecureLogout, getCurrentUserSession } from '@/utils/sessionManager';

interface RouteTest {
  path: string;
  label: string;
  shouldBeVisible: boolean;
  tested: boolean;
  working: boolean;
  error?: string;
}

interface RoleAudit {
  role: string;
  email: string;
  name: string;
  expectedRedirect: string;
  actualRedirect?: string;
  redirectWorking: boolean;
  navigationItems: RouteTest[];
  loginSuccess: boolean;
  logoutSuccess: boolean;
  error?: string;
}

const ComprehensiveLoginAudit = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [auditResults, setAuditResults] = useState<RoleAudit[]>([]);

  const roleTestData = [
    {
      role: 'admin',
      email: 'admin@lush.com',
      name: 'Sarah Chen',
      expectedRedirect: '/dashboard',
      routes: [
        { path: '/dashboard', label: 'Admin Dashboard', shouldBeVisible: true },
        { path: '/builder', label: 'Builder Portal', shouldBeVisible: true },
        { path: '/client', label: 'Client Portal', shouldBeVisible: true },
        { path: '/finance', label: 'Finance Portal', shouldBeVisible: true },
        { path: '/investor', label: 'Investor Portal', shouldBeVisible: true },
        { path: '/users', label: 'Team Manager', shouldBeVisible: true },
        { path: '/security', label: 'Security', shouldBeVisible: true }
      ]
    },
    {
      role: 'builder',
      email: 'builder@lush.com', 
      name: 'Mike Johnson',
      expectedRedirect: '/builder',
      routes: [
        { path: '/builder', label: 'My Dashboard', shouldBeVisible: true },
        { path: '/uploads', label: 'Upload Progress', shouldBeVisible: true },
        { path: '/timeline', label: 'Project Timeline', shouldBeVisible: true },
        { path: '/dashboard', label: 'Admin Dashboard', shouldBeVisible: false },
        { path: '/finance', label: 'Finance Portal', shouldBeVisible: false }
      ]
    },
    {
      role: 'investor',
      email: 'investor@lush.com',
      name: 'Robert Kim', 
      expectedRedirect: '/investor',
      routes: [
        { path: '/investor', label: 'My Investments', shouldBeVisible: true },
        { path: '/documents', label: 'Investment Docs', shouldBeVisible: true },
        { path: '/builder', label: 'Builder Portal', shouldBeVisible: false },
        { path: '/uploads', label: 'Uploads', shouldBeVisible: false }
      ]
    },
    {
      role: 'client',
      email: 'client@lush.com',
      name: 'Jennifer Williams',
      expectedRedirect: '/client', 
      routes: [
        { path: '/client', label: 'My Project', shouldBeVisible: true },
        { path: '/uploads', label: 'Project Progress', shouldBeVisible: true },
        { path: '/documents', label: 'My Documents', shouldBeVisible: true },
        { path: '/dashboard', label: 'Admin Dashboard', shouldBeVisible: false },
        { path: '/finance', label: 'Finance Portal', shouldBeVisible: false }
      ]
    },
    {
      role: 'accountant',
      email: 'accountant@lush.com', 
      name: 'Emma Davis',
      expectedRedirect: '/finance',
      routes: [
        { path: '/finance', label: 'Finance Dashboard', shouldBeVisible: true },
        { path: '/receipts', label: 'Receipt Management', shouldBeVisible: true },
        { path: '/claims', label: 'Payment Claims', shouldBeVisible: true },
        { path: '/builder', label: 'Builder Portal', shouldBeVisible: false },
        { path: '/investor', label: 'Investor Portal', shouldBeVisible: false }
      ]
    }
  ];

  const testRoute = async (path: string): Promise<{ working: boolean; error?: string }> => {
    return new Promise((resolve) => {
      try {
        // Create a test navigation element
        const testLink = document.createElement('a');
        testLink.href = path;
        testLink.style.display = 'none';
        document.body.appendChild(testLink);
        
        // Check if navigation items exist for this path
        const navElement = document.querySelector(`[data-nav-item="${path}"]`);
        const linkExists = navElement !== null;
        
        document.body.removeChild(testLink);
        
        resolve({
          working: linkExists,
          error: linkExists ? undefined : 'Navigation item not found'
        });
      } catch (error) {
        resolve({
          working: false,
          error: error.message
        });
      }
    });
  };

  const auditRole = async (roleData: typeof roleTestData[0]): Promise<RoleAudit> => {
    setCurrentTest(`Testing ${roleData.role} role...`);
    
    const audit: RoleAudit = {
      role: roleData.role,
      email: roleData.email,
      name: roleData.name,
      expectedRedirect: roleData.expectedRedirect,
      redirectWorking: false,
      navigationItems: [],
      loginSuccess: false,
      logoutSuccess: false
    };

    try {
      // Test login
      setCurrentTest(`Logging in as ${roleData.role}...`);
      await performSecureLogin({
        email: roleData.email,
        role: roleData.role,
        name: roleData.name
      });

      // Wait for navigation to settle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if session is properly set
      const currentUser = getCurrentUserSession();
      audit.loginSuccess = currentUser && currentUser.role === roleData.role;

      // Check redirect
      const currentPath = window.location.pathname;
      audit.actualRedirect = currentPath;
      audit.redirectWorking = currentPath === roleData.expectedRedirect;

      // Test each route
      setCurrentTest(`Testing navigation for ${roleData.role}...`);
      for (const route of roleData.routes) {
        const testResult = await testRoute(route.path);
        
        audit.navigationItems.push({
          path: route.path,
          label: route.label,
          shouldBeVisible: route.shouldBeVisible,
          tested: true,
          working: route.shouldBeVisible ? testResult.working : !testResult.working,
          error: testResult.error
        });
      }

      // Test logout
      setCurrentTest(`Testing logout for ${roleData.role}...`);
      performSecureLogout();
      
      // Wait for logout to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userAfterLogout = getCurrentUserSession();
      audit.logoutSuccess = !userAfterLogout;

    } catch (error) {
      audit.error = error.message;
      console.error(`❌ Role audit failed for ${roleData.role}:`, error);
    }

    return audit;
  };

  const runFullAudit = async () => {
    setIsRunning(true);
    setAuditResults([]);
    
    const results: RoleAudit[] = [];

    for (const roleData of roleTestData) {
      const audit = await auditRole(roleData);
      results.push(audit);
      setAuditResults([...results]); // Update results incrementally
    }

    setIsRunning(false);
    setCurrentTest('');
    console.log('🏁 Full login audit completed');
  };

  const testSingleRole = async (role: string) => {
    const roleData = roleTestData.find(r => r.role === role);
    if (roleData) {
      setIsRunning(true);
      const audit = await auditRole(roleData);
      setAuditResults([audit]);
      setIsRunning(false);
    }
  };

  const getSuccessRate = (audit: RoleAudit): number => {
    const total = audit.navigationItems.length + 2; // +2 for login and logout
    const passed = audit.navigationItems.filter(item => item.working).length + 
                   (audit.loginSuccess ? 1 : 0) + 
                   (audit.logoutSuccess ? 1 : 0);
    return Math.round((passed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Comprehensive Login Navigation Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Complete audit of login flow, navigation, and logout for all user roles
              </p>
              {currentTest && (
                <div className="mt-2 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-600">{currentTest}</span>
                </div>
              )}
            </div>
            <Button
              onClick={runFullAudit}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Run Full Audit
                </>
              )}
            </Button>
          </div>

          {/* Quick Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-medium">Test Single Role:</span>
            {roleTestData.map((role) => (
              <Button
                key={role.role}
                size="sm"
                variant="outline"
                onClick={() => testSingleRole(role.role)}
                disabled={isRunning}
              >
                {role.role}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Results */}
      {auditResults.map((audit) => (
        <Card key={audit.role}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Badge variant={audit.loginSuccess ? 'default' : 'destructive'}>
                  {audit.role}
                </Badge>
                {audit.name}
                <span className="text-sm text-gray-600">({audit.email})</span>
              </CardTitle>
              <div className="text-right">
                <div className="text-lg font-bold">{getSuccessRate(audit)}%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Login & Logout Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${audit.loginSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {audit.loginSuccess ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                  <span className="font-medium">Login Test</span>
                </div>
                <div className="text-sm mt-1">
                  <div>Expected: {audit.expectedRedirect}</div>
                  <div>Actual: {audit.actualRedirect || 'N/A'}</div>
                  <div className={audit.redirectWorking ? 'text-green-600' : 'text-red-600'}>
                    Redirect: {audit.redirectWorking ? 'Success' : 'Failed'}
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${audit.logoutSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {audit.logoutSuccess ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                  <span className="font-medium">Logout Test</span>
                </div>
                <div className="text-sm mt-1 text-gray-600">
                  Session cleanup: {audit.logoutSuccess ? 'Success' : 'Failed'}
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div>
              <h4 className="font-medium mb-2">Navigation Items</h4>
              <div className="space-y-2">
                {audit.navigationItems.map((item) => (
                  <div
                    key={item.path}
                    className={`p-2 rounded border ${
                      item.working
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.working ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        )}
                        <span className="text-sm font-medium">{item.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.path}
                        </Badge>
                      </div>
                      <div className="text-xs">
                        {item.shouldBeVisible ? 'Should Show' : 'Should Hide'}
                      </div>
                    </div>
                    {item.error && (
                      <div className="text-xs text-red-600 mt-1">{item.error}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {audit.error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Audit Error:</strong> {audit.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      {auditResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Audit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {auditResults.filter(a => a.loginSuccess).length}
                </div>
                <div className="text-sm text-gray-600">Successful Logins</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {auditResults.filter(a => a.redirectWorking).length}
                </div>
                <div className="text-sm text-gray-600">Correct Redirects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {auditResults.reduce((acc, a) => acc + a.navigationItems.filter(n => n.working).length, 0)}
                </div>
                <div className="text-sm text-gray-600">Working Nav Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(auditResults.reduce((acc, a) => acc + getSuccessRate(a), 0) / auditResults.length)}%
                </div>
                <div className="text-sm text-gray-600">Average Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveLoginAudit;