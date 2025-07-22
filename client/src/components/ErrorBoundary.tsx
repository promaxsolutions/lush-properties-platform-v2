import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to audit system if available
    if ((window as any).logAuditEvent) {
      (window as any).logAuditEvent({
        action: 'COMPONENT_ERROR',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Something went wrong</strong>
                <br />
                {this.state.error?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 bg-lush-primary hover:bg-lush-primary/90"
              >
                Go to Dashboard
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                If this continues, please contact support
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;