// Authentication API utilities for magic link system

export interface UserContext {
  email: string;
  name: string;
  firstName: string;
  role: string;
  projectId?: number;
  magicToken: string;
  lastLogin?: string;
}

export const verifyMagicToken = async (token: string): Promise<UserContext> => {
  const response = await fetch(`/api/magic/${token}`);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Invalid magic link');
  }
  
  return result.user;
};

export const getCurrentUser = async (): Promise<UserContext | null> => {
  try {
    const magicToken = localStorage.getItem('magicToken');
    
    if (!magicToken) {
      return null;
    }

    const response = await fetch('/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${magicToken}`
      }
    });

    if (!response.ok) {
      // Clear invalid token
      localStorage.removeItem('magicToken');
      localStorage.removeItem('userContext');
      return null;
    }

    const user = await response.json();
    return { ...user, magicToken };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('magicToken');
  localStorage.removeItem('userContext');
  window.location.href = '/';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('magicToken');
};