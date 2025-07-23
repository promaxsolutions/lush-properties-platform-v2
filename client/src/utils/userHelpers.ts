// Utility functions for user data management across all components
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("lush_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getUserDisplayName = (user: any) => {
  if (!user) return 'User';
  
  // Try to get name from user object
  if (user.name) return user.name;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  
  // Fall back to role-based display names
  switch (user.role) {
    case 'admin':
    case 'superadmin':
      return 'Administrator';
    case 'builder':
      return 'Builder';
    case 'client':
      return 'Client';
    case 'investor':
      return 'Investor';
    case 'accountant':
      return 'Accountant';
    default:
      return 'User';
  }
};

export const getUserEmail = (user: any) => {
  if (!user) return 'user@lush.com';
  
  // Use actual email if available
  if (user.email) return user.email;
  
  // Fall back to role-based emails for demo
  switch (user.role) {
    case 'admin':
      return 'admin@lush.com';
    case 'builder':
      return 'builder@lush.com';
    case 'client':
      return 'client@lush.com';
    case 'investor':
      return 'investor@lush.com';
    case 'accountant':
      return 'accountant@lush.com';
    default:
      return 'user@lush.com';
  }
};

export const getUserAvatar = (user: any) => {
  if (!user) return 'U';
  
  // Use first letter of name if available
  if (user.name) return user.name.charAt(0).toUpperCase();
  if (user.firstName) return user.firstName.charAt(0).toUpperCase();
  if (user.email) return user.email.charAt(0).toUpperCase();
  
  // Fall back to role letter
  return (user.role || 'user').charAt(0).toUpperCase();
};

export const secureLogout = () => {
  // Clear all user data
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear any remaining auth data
  localStorage.removeItem('lush_user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('session_id');
  
  // Trigger logout events
  window.dispatchEvent(new Event('logout'));
  
  // Redirect to login
  window.location.href = '/login';
};