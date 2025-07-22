import { useEffect } from 'react';
import { useAuth } from './AuthContext';

// Silent background role synchronization - no UI shown to users
const AuthSyncHandler = () => {
  const { user, role } = useAuth();

  useEffect(() => {
    // Auto-fix role detection issues silently
    const syncRoles = async () => {
      try {
        const userStr = localStorage.getItem("lush_user");
        if (!userStr) return;
        
        const userData = JSON.parse(userStr);
        const expectedRoles = {
          "admin@lush.com": "admin",
          "builder@lush.com": "builder", 
          "client@lush.com": "client",
          "investor@lush.com": "investor",
          "accountant@lush.com": "accountant"
        };

        const expectedRole = expectedRoles[userData.email?.toLowerCase()];
        
        // If role doesn't match expected role, fix it silently
        if (expectedRole && userData.role !== expectedRole) {
          console.log(`[AUTH-SYNC] Fixing role mismatch: ${userData.role} → ${expectedRole} for ${userData.email}`);
          
          userData.role = expectedRole;
          localStorage.setItem("lush_user", JSON.stringify(userData));
          
          // Force page reload to ensure all components pick up the new role
          window.location.reload();
          return;
        }

        // Check if we're on the wrong dashboard for our role, but only auto-redirect if we're on a dashboard page
        const dashboards = {
          admin: '/dashboard',
          builder: '/builder',
          client: '/client',
          accountant: '/finance',
          investor: '/investor'
        };
        
        const currentRole = userData.role;
        const correctDashboard = dashboards[currentRole];
        const currentPath = window.location.pathname;
        
        // Only auto-redirect if we're on a dashboard page that doesn't match our role
        // Admin users can access any portal, so don't redirect them
        const dashboardPaths = ['/dashboard', '/builder', '/client', '/finance', '/investor'];
        if (correctDashboard && 
            dashboardPaths.includes(currentPath) &&
            currentPath !== correctDashboard &&
            currentRole !== 'admin' && currentRole !== 'superadmin') {
          console.log(`[AUTH-SYNC] Redirecting ${currentRole} from ${currentPath} to ${correctDashboard}`);
          window.location.href = correctDashboard;
        }
      } catch (error) {
        // Silent error handling - don't show users technical errors
        console.debug('Auth sync handled:', error);
      }
    };

    // Run sync immediately and on any changes
    syncRoles();
    
    // Also run sync when localStorage changes
    const handleStorageChange = () => syncRoles();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, [user, role]);

  // This component renders nothing - it's purely for background sync
  return null;
};

export default AuthSyncHandler;