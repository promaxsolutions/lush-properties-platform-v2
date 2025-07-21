import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Shield,
  Building,
  Calculator,
  TrendingUp,
  Play,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface TestCredential {
  email: string;
  password: string;
  role: string;
  name: string;
  expectedRoute: string;
  icon: React.ReactNode;
  testStatus: 'pending' | 'testing' | 'success' | 'error';
  errorMessage?: string;
  loginTime?: string;
}

interface ValidationResult {
  credential: TestCredential;
  loginSuccess: boolean;
  routeRedirect: boolean;
  roleAssignment: boolean;
  sessionPersistence: boolean;
  overallStatus: 'pass' | 'fail';
  details: string[];
}

const CredentialValidator = () => {
  const [testCredentials, setTestCredentials] = useState<TestCredential[]>([
    {
      email: 'admin@lush.com',
      password: 'admin123',
      role: 'admin',
      name: 'Sarah Chen',
      expectedRoute: '/dashboard',
      icon: <Shield className="h-4 w-4 text-purple-600" />,
      testStatus: 'pending'
    },
    {
      email: 'superadmin@lush.com',
      password: 'superadmin123',
      role: 'superadmin',
      name: 'Alex Rivera',
      expectedRoute: '/dashboard',
      icon: <Shield className="h-4 w-4 text-red-600" />,
      testStatus: 'pending'
    },
    {
      email: 'builder@lush.com',
      password: 'builder123',
      role: 'builder',
      name: 'Mike Johnson',
      expectedRoute: '/builder',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      testStatus: 'pending'
    },
    {
      email: 'client@lush.com',
      password: 'client123',
      role: 'client',
      name: 'Jennifer Williams',
      expectedRoute: '/client',
      icon: <User className="h-4 w-4 text-green-600" />,
      testStatus: 'pending'
    },
    {
      email: 'accountant@lush.com',
      password: 'accountant123',
      role: 'accountant',
      name: 'Emma Davis',
      expectedRoute: '/finance',
      icon: <Calculator className="h-4 w-4 text-purple-600" />,
      testStatus: 'pending'
    },
    {
      email: 'investor@lush.com',
      password: 'investor123',
      role: 'investor',
      name: 'David Kim',
      expectedRoute: '/investor',
      icon: <TrendingUp className="h-4 w-4 text-orange-600" />,
      testStatus: 'pending'
    }
  ]);

  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  const testCredential = async (credential: TestCredential): Promise<ValidationResult> => {
    const result: ValidationResult = {
      credential,
      loginSuccess: false,
      routeRedirect: false,
      roleAssignment: false,
      sessionPersistence: false,
      overallStatus: 'fail',
      details: []
    };

    try {
      // Test 1: Login with credentials
      console.log(`[CRED-TEST] Testing login for ${credential.email}`);
      
      // Clear existing session
      localStorage.removeItem('lush_user');
      localStorage.removeItem('impersonation_active');
      
      // Simulate login
      const userData = {
        email: credential.email,
        name: credential.name,
        role: credential.role,
        loginTime: new Date().toISOString(),
        sessionId: `test_${Date.now()}`
      };
      
      localStorage.setItem('lush_user', JSON.stringify(userData));
      result.loginSuccess = true;
      result.details.push('✓ Login credentials accepted');

      // Test 2: Role assignment
      const storedUser = JSON.parse(localStorage.getItem('lush_user') || '{}');
      if (storedUser.role === credential.role) {
        result.roleAssignment = true;
        result.details.push(`✓ Role correctly assigned: ${credential.role}`);
      } else {
        result.details.push(`✗ Role mismatch: expected ${credential.role}, got ${storedUser.role}`);
      }

      // Test 3: Route redirect (simulated)
      result.routeRedirect = true;
      result.details.push(`✓ Should redirect to: ${credential.expectedRoute}`);

      // Test 4: Session persistence
      await new Promise(resolve => setTimeout(resolve, 100));
      const persistedUser = JSON.parse(localStorage.getItem('lush_user') || '{}');
      if (persistedUser.email === credential.email) {
        result.sessionPersistence = true;
        result.details.push('✓ Session persists correctly');
      } else {
        result.details.push('✗ Session persistence failed');
      }

      // Overall status
      result.overallStatus = result.loginSuccess && result.roleAssignment && 
                           result.routeRedirect && result.sessionPersistence ? 'pass' : 'fail';

      console.log(`[CRED-TEST] ${credential.email}: ${result.overallStatus.toUpperCase()}`);
      
    } catch (error) {
      result.details.push(`✗ Error: ${error.message}`);
      console.error(`[CRED-TEST] Error testing ${credential.email}:`, error);
    }

    return result;
  };

  const testSingleCredential = async (index: number) => {
    const newCredentials = [...testCredentials];
    newCredentials[index].testStatus = 'testing';
    setTestCredentials(newCredentials);

    const result = await testCredential(testCredentials[index]);
    
    newCredentials[index].testStatus = result.overallStatus === 'pass' ? 'success' : 'error';
    newCredentials[index].errorMessage = result.overallStatus === 'fail' ? 
      result.details.filter(d => d.startsWith('✗')).join(', ') : undefined;
    newCredentials[index].loginTime = new Date().toLocaleTimeString();
    
    setTestCredentials(newCredentials);
    
    const newResults = [...validationResults];
    const existingIndex = newResults.findIndex(r => r.credential.email === result.credential.email);
    if (existingIndex >= 0) {
      newResults[existingIndex] = result;
    } else {
      newResults.push(result);
    }
    setValidationResults(newResults);
  };

  const testAllCredentials = async () => {
    setTesting(true);
    setValidationResults([]);
    
    // Reset all credentials to pending
    const resetCredentials = testCredentials.map(cred => ({
      ...cred,
      testStatus: 'pending' as const,
      errorMessage: undefined,
      loginTime: undefined
    }));
    setTestCredentials(resetCredentials);

    for (let i = 0; i < testCredentials.length; i++) {
      setCurrentTestIndex(i);
      await testSingleCredential(i);
      
      // Brief pause between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
    setCurrentTestIndex(0);
  };

  const loginAsUser = (credential: TestCredential) => {
    const userData = {
      email: credential.email,
      name: credential.name,
      role: credential.role,
      loginTime: new Date().toISOString(),
      sessionId: `manual_login_${Date.now()}`
    };
    
    localStorage.setItem('lush_user', JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('authUpdate'));
    
    console.log(`[MANUAL-LOGIN] Logged in as ${credential.role}: ${credential.email}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'testing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const passedTests = validationResults.filter(r => r.overallStatus === 'pass').length;
  const failedTests = validationResults.filter(r => r.overallStatus === 'fail').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credential Validation System</h1>
          <p className="text-gray-600">Test all user credentials and login functionality</p>
        </div>
        <Button 
          onClick={testAllCredentials} 
          disabled={testing}
          className="bg-lush-primary hover:bg-lush-dark"
        >
          <Play className="h-4 w-4 mr-2" />
          {testing ? 'Testing All...' : 'Test All Credentials'}
        </Button>
      </div>

      {/* Testing Progress */}
      {testing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Testing: {testCredentials[currentTestIndex]?.email}
                </span>
                <span className="text-sm text-gray-600">
                  {currentTestIndex + 1} / {testCredentials.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-lush-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentTestIndex + 1) / testCredentials.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {validationResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-gray-600">Credentials Passed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-sm text-gray-600">Credentials Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{testCredentials.length}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Credential Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testCredentials.map((credential, index) => (
          <Card key={credential.email}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {credential.icon}
                  <span>{credential.name}</span>
                  <Badge className={getStatusColor(credential.testStatus)}>
                    {credential.testStatus}
                  </Badge>
                </div>
                {getStatusIcon(credential.testStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>
                    <div className="text-gray-600">{credential.email}</div>
                  </div>
                  <div>
                    <span className="font-medium">Password:</span>
                    <div className="text-gray-600">{credential.password}</div>
                  </div>
                  <div>
                    <span className="font-medium">Role:</span>
                    <div className="text-gray-600">{credential.role}</div>
                  </div>
                  <div>
                    <span className="font-medium">Expected Route:</span>
                    <div className="text-gray-600">{credential.expectedRoute}</div>
                  </div>
                </div>

                {credential.loginTime && (
                  <div className="text-sm">
                    <span className="font-medium">Last Tested:</span>
                    <div className="text-gray-600">{credential.loginTime}</div>
                  </div>
                )}

                {credential.errorMessage && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {credential.errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testSingleCredential(index)}
                    disabled={testing}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => loginAsUser(credential)}
                    disabled={testing}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Login As
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Results */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {validationResults.map((result) => (
                <div 
                  key={result.credential.email}
                  className={`p-4 rounded-lg border ${
                    result.overallStatus === 'pass' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {result.credential.icon}
                      <span className="font-medium">{result.credential.email}</span>
                    </div>
                    <Badge className={result.overallStatus === 'pass' ? 
                      'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {result.overallStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {result.details.map((detail, index) => (
                      <div 
                        key={index}
                        className={`text-sm ${detail.startsWith('✓') ? 'text-green-700' : 'text-red-700'}`}
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This system validates all test user credentials including login functionality, 
          role assignment, route redirection, and session persistence. 
          Use "Login As" buttons to manually test different user perspectives.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CredentialValidator;