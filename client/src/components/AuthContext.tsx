import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for user data instead of Firebase
    const checkLocalStorageUser = () => {
      try {
        const userStr = localStorage.getItem("lush_user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setRole(userData.role);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        setUser(null);
        setRole(null);
      }
    };

    // Initial check
    checkLocalStorageUser();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lush_user") {
        checkLocalStorageUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when login happens in same tab
    const handleLoginEvent = () => {
      checkLocalStorageUser();
    };
    
    const handleAuthChange = () => {
      checkLocalStorageUser();
    };
    
    window.addEventListener('userLogin', handleLoginEvent);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLoginEvent);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return <AuthContext.Provider value={{ user, role }}>{children}</AuthContext.Provider>;
};