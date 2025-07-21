import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { getCurrentUserSession } from '@/utils/sessionManager';

interface ValidationResult {
  path: string;
  isValid: boolean;
  errorType?: string;
  expectedRole?: string;
  actualRole?: string;
}

const NavigationValidator = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Test paths for different roles
  const testPaths = [
    { path: '/dashboard', allowedRoles: ['admin'] },
    { path: '/builder', allowedRoles: ['builder', 'admin'] },
    { path: '/client', allowedRoles: ['client', 'admin'] },
    { path: '/finance', allowedRoles: ['accountant', 'admin'] },
    { path: '/investor', allowedRoles: ['investor', 'admin'] },
    { path: '/projects', allowedRoles: ['admin'] },
    { path: '/settings', allowedRoles: ['admin'] },
  ];

  useEffect(() => {
    const user = getCurrentUserSession();
    setCurrentUser(user);
    if (user) {
      validateNavigation();
    }
  }, []);

  const validateNavigation = async () => {
    setIsValidating(true);
    const user = getCurrentUserSession();
    
    if (!user) {
      setValidationResults([]);
      setIsValidating(false);
      return;
    }

    const results: ValidationResult[] = [];

    for (const testPath of testPaths) {
      const hasAccess = testPath.allowedRoles.includes(user.role);
      
      results.push({
        path: testPath.path,
        isValid: hasAccess,
        errorType: hasAccess ? undefined : 'access_denied',
        expectedRole: hasAccess ? user.role : testPath.allowedRoles.join(' or '),
        actualRole: user.role
      });
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  const testNavigation = (path: string) => {
    window.open(path, '_blank');
  };

  if (!currentUser) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          No user session found. Please log in to validate navigation.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Navigation Validation</h3>
          <p className="text-sm text-gray-600">
            Current Role: <span className="font-medium text-lush-primary">{currentUser.role}</span>
          </p>
        </div>
        <Button
          onClick={validateNavigation}
          disabled={isValidating}
          size="sm"
          variant="outline"
        >
          {isValidating ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Revalidate
        </Button>
      </div>

      <div className="grid gap-3">
        {validationResults.map((result) => (
          <div
            key={result.path}
            className={`p-3 rounded-lg border ${
              result.isValid
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium">{result.path}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => testNavigation(result.path)}
                  className="h-8 px-2"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {!result.isValid && (
              <div className="mt-2 text-xs text-red-700">
                <div>Access restricted to: {result.expectedRole}</div>
                <div>Your role: {result.actualRole}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <div className="text-sm space-y-1">
            <div><strong>Valid paths:</strong> {validationResults.filter(r => r.isValid).length}</div>
            <div><strong>Restricted paths:</strong> {validationResults.filter(r => !r.isValid).length}</div>
            <div className="mt-2 text-xs">
              Click the <ExternalLink className="inline h-3 w-3" /> icon to test navigation in a new tab.
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NavigationValidator;