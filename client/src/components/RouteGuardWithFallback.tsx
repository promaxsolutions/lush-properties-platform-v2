import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

interface RouteGuardWithFallbackProps {
  children: React.ReactNode;
  allowedRoles: string[];
  userRole?: string;
  fallbackRoute?: string;
}

const RouteGuardWithFallback: React.FC<RouteGuardWithFallbackProps> = ({
  children,
  allowedRoles,
  userRole,
  fallbackRoute = '/dashboard'
}) => {
  const [location, setLocation] = useLocation();

  // Define all valid routes based on role
  const VALID_ROUTES = {
    admin: [
      '/dashboard', '/builder', '/client', '/finance', '/investor', '/users', '/audit',
      '/contracts', '/profits', '/ai-workflows', '/uploads', '/documents', '/receipts',
      '/claims', '/timeline', '/settings', '/heatmap', '/role-dashboard', '/admin/role-manager',
      '/comprehensive-test', '/role-flow-tester', '/manual-role-tester', '/login-tester',
      '/nav-test', '/nav-validator', '/credential-test', '/mobile', '/smart-upload',
      '/budget-analyzer', '/budget-test', '/claim-engine', '/claim-test', '/claim-history',
      '/lender-simulator', '/secure-panel', '/builder-timeline', '/claim-dashboard',
      '/polished-dashboard', '/security-panel', '/walkthrough'
    ],
    superadmin: [
      '/dashboard', '/builder', '/client', '/finance', '/investor', '/users', '/audit',
      '/contracts', '/profits', '/ai-workflows', '/uploads', '/documents', '/receipts',
      '/claims', '/timeline', '/settings', '/heatmap', '/role-dashboard', '/admin/role-manager',
      '/comprehensive-test', '/role-flow-tester', '/manual-role-tester', '/login-tester',
      '/nav-test', '/nav-validator', '/credential-test', '/mobile', '/smart-upload',
      '/budget-analyzer', '/budget-test', '/claim-engine', '/claim-test', '/claim-history',
      '/lender-simulator', '/secure-panel', '/builder-timeline', '/claim-dashboard',
      '/polished-dashboard', '/security-panel', '/walkthrough', '/impersonate'
    ],
    builder: [
      '/builder', '/uploads', '/timeline', '/documents', '/receipts', '/smart-upload',
      '/secure-panel', '/builder-timeline'
    ],
    client: [
      '/client', '/uploads', '/documents', '/project-view', '/enhanced-receipts'
    ],
    accountant: [
      '/finance', '/receipts', '/claims', '/uploads', '/budget-analyzer', '/claim-engine',
      '/claim-history', '/claim-dashboard'
    ],
    investor: [
      '/investor', '/documents', '/heatmap', '/investor-portal'
    ]
  };

  // Route fallback logic
  useEffect(() => {
    const currentPath = location;
    const userRoutes = userRole ? VALID_ROUTES[userRole as keyof typeof VALID_ROUTES] || [] : [];
    
    // Check if current route is valid for user role
    if (!userRoutes.includes(currentPath)) {
      console.log(`[Route Guard] Invalid route ${currentPath} for role ${userRole}, redirecting to ${fallbackRoute}`);
      setLocation(fallbackRoute);
      return;
    }

    // Check if user has permission for this route
    if (userRole && !allowedRoles.includes(userRole)) {
      console.log(`[Route Guard] Access denied to ${currentPath} for role ${userRole}, redirecting to ${fallbackRoute}`);
      setLocation(fallbackRoute);
      return;
    }
  }, [location, userRole, allowedRoles, fallbackRoute, setLocation]);

  // Additional check for unknown routes
  useEffect(() => {
    const currentPath = location;
    const allValidRoutes = Object.values(VALID_ROUTES).flat();
    
    if (!allValidRoutes.includes(currentPath) && !currentPath.startsWith('/invite/')) {
      console.log(`[Route Guard] Unknown route ${currentPath}, redirecting to ${fallbackRoute}`);
      setLocation(fallbackRoute);
    }
  }, [location, fallbackRoute, setLocation]);

  // Check role permissions
  if (!userRole || !allowedRoles.includes(userRole)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default RouteGuardWithFallback;