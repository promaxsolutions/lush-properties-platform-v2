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
          userData.role = expectedRole;
          localStorage.setItem("lush_user", JSON.stringify(userData));
          window.dispatchEvent(new CustomEvent('userLogin'));
          
          // Silent redirect to correct dashboard
          const dashboards = {
            admin: '/dashboard',
            builder: '/builder',
            client: '/client',
            accountant: '/finance',
            investor: '/investor'
          };
          
          const correctDashboard = dashboards[expectedRole];
          if (correctDashboard && window.location.pathname !== correctDashboard) {
            window.location.href = correctDashboard;
          }
        }
      } catch (error) {
        // Silent error handling - don't show users technical errors
        console.debug('Auth sync handled:', error);
      }
    };

    // Run sync on mount and when user/role changes
    syncRoles();
  }, [user, role]);

  // This component renders nothing - it's purely for background sync
  return null;
};

export default AuthSyncHandler;