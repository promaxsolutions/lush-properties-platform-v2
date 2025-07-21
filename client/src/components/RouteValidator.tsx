import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

interface RouteValidation {
  path: string;
  exists: boolean;
  accessible: boolean;
  component: string;
  guards: string[];
}

const RouteValidator = () => {
  const [validationResults, setValidationResults] = useState<RouteValidation[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const criticalRoutes = [
    '/login',
    '/dashboard',
    '/builder',
    '/client', 
    '/finance',
    '/investor',
    '/uploads',
    '/documents',
    '/receipts',
    '/claims',
    '/timeline'
  ];

  const validateRoutes = async () => {
    setIsValidating(true);
    const results: RouteValidation[] = [];

    for (const route of criticalRoutes) {
      try {
        // Check if route exists by creating a test navigation
        const testResult = await new Promise<boolean>((resolve) => {
          const testFrame = document.createElement('iframe');
          testFrame.style.display = 'none';
          testFrame.src = route;
          
          testFrame.onload = () => {
            document.body.removeChild(testFrame);
            resolve(true);
          };
          
          testFrame.onerror = () => {
            document.body.removeChild(testFrame);
            resolve(false);
          };
          
          document.body.appendChild(testFrame);
          
          // Timeout after 2 seconds
          setTimeout(() => {
            if (document.body.contains(testFrame)) {
              document.body.removeChild(testFrame);
              resolve(false);
            }
          }, 2000);
        });

        results.push({
          path: route,
          exists: testResult,
          accessible: testResult,
          component: 'Unknown',
          guards: []
        });

      } catch (error) {
        results.push({
          path: route,
          exists: false,
          accessible: false,
          component: 'Error',
          guards: []
        });
      }
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  const testRoute = (path: string) => {
    window.open(path, '_blank');
  };

  useEffect(() => {
    // Auto-validate on component mount
    validateRoutes();
  }, []);

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Route Validator</h3>
          <p className="text-sm text-gray-600">Validate critical application routes</p>
        </div>
        <Button
          onClick={validateRoutes}
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

      <div className="space-y-2">
        {validationResults.map((result) => (
          <div
            key={result.path}
            className={`p-3 rounded-lg border ${
              result.exists && result.accessible
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.exists && result.accessible ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium">{result.path}</span>
                <Badge variant={result.exists ? 'default' : 'destructive'}>
                  {result.exists ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => testRoute(result.path)}
                className="h-8 px-2"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <div className="text-sm space-y-1">
            <div><strong>Valid routes:</strong> {validationResults.filter(r => r.exists).length}</div>
            <div><strong>Invalid routes:</strong> {validationResults.filter(r => !r.exists).length}</div>
            <div><strong>Total tested:</strong> {validationResults.length}</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default RouteValidator;