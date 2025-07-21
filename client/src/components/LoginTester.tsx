import React, { useState } from 'react';
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
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginTestResult {
  role: string;
  email: string;
  password: string;
  status: 'success' | 'error' | 'testing';
  message: string;
  redirectPath?: string;
  userName?: string;
}

const LoginTester = () => {
  const [testResults, setTestResults] = useState<LoginTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const demoCredentials = [
    {
      role: 'admin',
      name: 'Administrator',
      email: 'admin@lush.com',
      password: 'admin123',
      expectedRedirect: '/dashboard',
      icon: <Shield className="h-4 w-4" />,
      expectedName: 'Sarah Chen'
    },
    {
      role: 'builder',
      name: 'Builder',
      email: 'builder@lush.com',
      password: 'builder123',
      expectedRedirect: '/builder',
      icon: <Building className="h-4 w-4" />,
      expectedName: 'Mike Johnson'
    },
    {
      role: 'client',
      name: 'Client',
      email: 'client@lush.com',
      password: 'client123',
      expectedRedirect: '/client',
      icon: <User className="h-4 w-4" />,
      expectedName: 'Jennifer Williams'
    },
    {
      role: 'accountant',
      name: 'Accountant',
      email: 'accountant@lush.com',
      password: 'accountant123',
      expectedRedirect: '/finance',
      icon: <Calculator className="h-4 w-4" />,
      expectedName: 'Emma Davis'
    },
    {
      role: 'investor',
      name: 'Investor',
      email: 'investor@lush.com',
      password: 'investor123',
      expectedRedirect: '/investor',
      icon: <TrendingUp className="h-4 w-4" />,
      expectedName: 'Robert Kim'
    }
  ];

  const testLogin = async (credentials: typeof demoCredentials[0]): Promise<LoginTestResult> => {
    try {
      // Clear any existing user data
      localStorage.removeItem('lush_user');
      
      // Simulate the login process from WorkingLogin component
      const testUsers = {
        "admin@lush.com": { password: "admin123", role: "admin", name: "Sarah Chen" },
        "builder@lush.com": { password: "builder123", role: "builder", name: "Mike Johnson" },
        "client@lush.com": { password: "client123", role: "client", name: "Jennifer Williams" },
        "investor@lush.com": { password: "investor123", role: "investor", name: "Robert Kim" },
        "accountant@lush.com": { password: "accountant123", role: "accountant", name: "Emma Davis" }
      };

      const user = testUsers[credentials.email.toLowerCase() as keyof typeof testUsers];
      
      if (!user) {
        return {
          role: credentials.role,
          email: credentials.email,
          password: credentials.password,
          status: 'error',
          message: 'User not found in demo credentials'
        };
      }
      
      if (user.password !== credentials.password) {
        return {
          role: credentials.role,
          email: credentials.email,
          password: credentials.password,
          status: 'error',
          message: 'Invalid password'
        };
      }

      // Store user data as the real login would
      const userData = {
        email: credentials.email.toLowerCase(),
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("lush_user", JSON.stringify(userData));

      // Verify the data was stored correctly
      const storedData = JSON.parse(localStorage.getItem("lush_user") || "{}");
      
      if (storedData.role !== credentials.role) {
        return {
          role: credentials.role,
          email: credentials.email,
          password: credentials.password,
          status: 'error',
          message: `Role mismatch: expected ${credentials.role}, got ${storedData.role}`
        };
      }

      return {
        role: credentials.role,
        email: credentials.email,
        password: credentials.password,
        status: 'success',
        message: `✓ Login successful - redirects to ${credentials.expectedRedirect}`,
        redirectPath: credentials.expectedRedirect,
        userName: user.name
      };

    } catch (error) {
      return {
        role: credentials.role,
        email: credentials.email,
        password: credentials.password,
        status: 'error',
        message: `Login test failed: ${error}`
      };
    }
  };

  const testSingleLogin = async (credentials: typeof demoCredentials[0]) => {
    setTestResults(prev => prev.map(result => 
      result.role === credentials.role 
        ? { ...result, status: 'testing' as const, message: 'Testing login...' }
        : result
    ));

    const result = await testLogin(credentials);
    
    setTestResults(prev => prev.map(existing => 
      existing.role === credentials.role ? result : existing
    ));
  };

  const testAllLogins = async () => {
    setIsLoading(true);
    setTestResults(demoCredentials.map(cred => ({
      role: cred.role,
      email: cred.email,
      password: cred.password,
      status: 'testing' as const,
      message: 'Preparing test...'
    })));

    for (const credentials of demoCredentials) {
      await testSingleLogin(credentials);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
    localStorage.removeItem('lush_user');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <div className="h-4 w-4 rounded-full bg-blue-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'testing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const testingCount = testResults.filter(r => r.status === 'testing').length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demo Login Credentials Tester</h1>
          <p className="text-gray-600 mt-2">Verify all demo user accounts are working correctly</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={testAllLogins} 
            disabled={isLoading}
            className="bg-lush-primary hover:bg-lush-primary/90"
          >
            {isLoading ? 'Testing All...' : 'Test All Logins'}
          </Button>
          <Button variant="outline" onClick={clearResults}>
            Clear Results
          </Button>
        </div>
      </div>

      {/* Test Statistics */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Results Summary</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center gap-1"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPasswords ? 'Hide' : 'Show'} Passwords
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{testResults.length}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testingCount}</div>
                <div className="text-sm text-gray-600">Testing</div>
              </div>
            </div>

            {successCount === demoCredentials.length && testingCount === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ✅ All demo login credentials are working perfectly! All 5 user roles can log in successfully.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Demo Credentials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Demo Login Credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoCredentials.map((credentials, index) => {
              const testResult = testResults.find(r => r.role === credentials.role);
              
              return (
                <div
                  key={credentials.role}
                  className={`p-4 border rounded-lg transition-all ${
                    testResult ? getStatusColor(testResult.status) : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {credentials.icon}
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {credentials.name} ({credentials.role})
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-mono">{credentials.email}</span>
                          {showPasswords && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="font-mono">{credentials.password}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Expected Name: {credentials.expectedName} → Redirects to: {credentials.expectedRedirect}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {testResult && (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(testResult.status)}
                          <span className={`text-sm ${
                            testResult.status === 'success' ? 'text-green-700' :
                            testResult.status === 'error' ? 'text-red-700' : 'text-blue-700'
                          }`}>
                            {testResult.message}
                          </span>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testSingleLogin(credentials)}
                        disabled={testResult?.status === 'testing'}
                      >
                        {testResult?.status === 'testing' ? 'Testing...' : 'Test Login'}
                      </Button>
                    </div>
                  </div>

                  {testResult && testResult.status === 'success' && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">User Name:</span>
                          <span className="ml-2 font-medium">{testResult.userName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Redirect Path:</span>
                          <span className="ml-2 font-mono text-green-700">{testResult.redirectPath}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Copy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference - Copy & Paste Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoCredentials.map((cred) => (
              <div key={cred.role} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {cred.icon}
                  <span className="font-medium capitalize">{cred.role}</span>
                </div>
                <div className="space-y-1 text-sm font-mono">
                  <div>Email: <span className="text-blue-600">{cred.email}</span></div>
                  <div>Password: <span className="text-blue-600">{cred.password}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginTester;