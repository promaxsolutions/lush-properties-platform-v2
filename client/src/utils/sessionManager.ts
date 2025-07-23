// Session management utilities for clean logout and login flows

export const clearAllUserData = () => {
  // Clear all localStorage items
  localStorage.clear();
  
  // Clear all sessionStorage items
  sessionStorage.clear();
  
  // Clear specific auth-related items that might persist
  const authKeys = [
    'lush_user',
    'magicToken',
    'userContext',
    'authToken',
    'user_session',
    'login_time',
    'role_data',
    'user_permissions'
  ];
  
  authKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  
  // Clear any cached data in browser storage
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  console.log('🧹 All user data cleared from storage');
};

export const triggerAuthUpdate = () => {
  // Dispatch multiple events to ensure all components update
  const events = ['userLogin', 'authChange', 'storage', 'roleChange', 'sessionUpdate'];
  
  events.forEach(eventName => {
    window.dispatchEvent(new CustomEvent(eventName));
    // Also dispatch with detail for better event handling
    window.dispatchEvent(new CustomEvent(eventName, { 
      detail: { 
        timestamp: Date.now(),
        action: 'auth_update'
      }
    }));
  });
  
  console.log('🔄 Auth update events triggered');
};

export const setUserSession = (userData: any) => {
  // Ensure consistent user data structure
  const sessionData = {
    ...userData,
    loginTime: new Date().toISOString(),
    sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };
  
  // Store in localStorage
  localStorage.setItem('lush_user', JSON.stringify(sessionData));
  
  // Also store individual fields for easier access
  localStorage.setItem('user_role', userData.role);
  localStorage.setItem('user_email', userData.email);
  localStorage.setItem('user_name', userData.name);
  
  console.log('💾 User session data stored:', sessionData);
  
  return sessionData;
};

export const getCurrentUserSession = () => {
  try {
    const userStr = localStorage.getItem('lush_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      // Validate data structure
      if (userData.email && userData.role && userData.name) {
        return userData;
      }
    }
  } catch (error) {
    console.error('❌ Failed to parse user session:', error);
  }
  return null;
};

export const performSecureLogout = () => {
  console.log('🚪 Starting secure logout process...');
  
  // Clear all data
  clearAllUserData();
  
  // Reset user context to null
  window.dispatchEvent(new CustomEvent('userLogout'));
  
  // Trigger auth updates
  triggerAuthUpdate();
  
  // Small delay to ensure cleanup
  setTimeout(() => {
    // Force full page reload to clear any cached state
    window.location.href = '/login';
  }, 200);
};

export const performSecureLogin = async (userData: any) => {
  console.log('🔐 Starting secure login process...', userData);
  
  // First clear any existing data
  clearAllUserData();
  
  // Wait for cleanup
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Set new session data
  const sessionData = setUserSession(userData);
  
  // Trigger auth updates
  triggerAuthUpdate();
  
  // Determine correct dashboard based on role
  const dashboards = {
    admin: '/dashboard',
    builder: '/builder',
    client: '/client',
    accountant: '/finance',
    investor: '/investor'
  };
  
  const targetDashboard = dashboards[userData.role as keyof typeof dashboards] || '/dashboard';
  
  // Store fresh role to prevent reuse
  localStorage.setItem('current_role', userData.role);
  localStorage.setItem('login_timestamp', Date.now().toString());
  
  // Small delay to ensure data is set, then force complete reload
  setTimeout(() => {
    // Force full page reload to reinitialize app with fresh session
    console.log(`🔄 Forcing page reload to refresh navigation for ${userData.role} role`);
    window.location.href = targetDashboard;
  }, 300);
  
  return sessionData;
};

export const validateUserSession = () => {
  const userData = getCurrentUserSession();
  
  if (!userData) {
    console.log('❌ No valid user session found');
    return false;
  }
  
  // Check if session is recent (not older than 24 hours)
  const loginTime = new Date(userData.loginTime);
  const now = new Date();
  const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff > 24) {
    console.log('⏰ User session expired (>24 hours)');
    clearAllUserData();
    return false;
  }
  
  console.log('✅ Valid user session found:', {
    role: userData.role,
    email: userData.email,
    loginTime: userData.loginTime
  });
  
  return true;
};