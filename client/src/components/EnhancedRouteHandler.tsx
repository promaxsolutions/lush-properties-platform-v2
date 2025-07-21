import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

interface EnhancedRouteHandlerProps {
  userRole?: string;
}

const EnhancedRouteHandler: React.FC<EnhancedRouteHandlerProps> = ({ userRole }) => {
  const [location, setLocation] = useLocation();

  // Define all valid routes per role
  const ROUTES = {
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

  // Role-specific default routes
  const DEFAULT_ROUTES = {
    admin: '/dashboard',
    superadmin: '/dashboard',
    builder: '/builder',
    client: '/client',
    accountant: '/finance',
    investor: '/investor'
  };

  // On route change failure, fallback to appropriate dashboard
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    // Skip processing for special routes
    if (currentPath.startsWith('/invite/') || currentPath === '/login' || currentPath === '/') {
      return;
    }

    // Get valid routes for current user role
    const userRoutes = userRole ? ROUTES[userRole as keyof typeof ROUTES] || [] : [];
    const fallbackRoute = userRole ? DEFAULT_ROUTES[userRole as keyof typeof DEFAULT_ROUTES] || '/dashboard' : '/dashboard';

    // Check if current route is valid for this user
    if (!userRoutes.includes(currentPath)) {
      console.log(`[Route Handler] Invalid route ${currentPath} for role ${userRole}, redirecting to ${fallbackRoute}`);
      setLocation(fallbackRoute);
      return;
    }

    console.log(`[Route Handler] Route ${currentPath} is valid for role ${userRole}`);
  }, [location, userRole, setLocation]);

  // Global route validation for unknown paths
  useEffect(() => {
    const currentPath = window.location.pathname;
    const allValidRoutes = Object.values(ROUTES).flat();
    
    // Allow special routes
    if (currentPath.startsWith('/invite/') || 
        currentPath === '/login' || 
        currentPath === '/' ||
        currentPath === '/register') {
      return;
    }

    // Check if route exists in any role
    if (!allValidRoutes.includes(currentPath)) {
      const fallbackRoute = userRole ? DEFAULT_ROUTES[userRole as keyof typeof DEFAULT_ROUTES] || '/dashboard' : '/dashboard';
      console.log(`[Route Handler] Unknown route ${currentPath}, redirecting to ${fallbackRoute}`);
      setLocation(fallbackRoute);
    }
  }, [location, userRole, setLocation]);

  return null;
};

export default EnhancedRouteHandler;