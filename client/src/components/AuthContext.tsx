import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUserSession, validateUserSession } from "@/utils/sessionManager";

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
    // Enhanced user validation with session management
    const checkUserSession = () => {
      try {
        // First validate if session is still valid
        if (!validateUserSession()) {
          setUser(null);
          setRole(null);
          return;
        }
        
        // Get current user session
        const userData = getCurrentUserSession();
        if (userData) {
          console.log('[AUTH-CONTEXT] User session loaded:', userData.role);
          setUser(userData);
          setRole(userData.role);
        } else {
          console.log('[AUTH-CONTEXT] No valid user session');
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("[AUTH-CONTEXT] Session check failed:", error);
        setUser(null);
        setRole(null);
      }
    };

    // Initial session check
    checkUserSession();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lush_user" || e.key === null) {
        console.log('[AUTH-CONTEXT] Storage change detected, rechecking session');
        checkUserSession();
      }
    };

    // Listen for various auth-related events
    const handleAuthEvents = () => {
      console.log('[AUTH-CONTEXT] Auth event triggered, rechecking session');
      checkUserSession();
    };
    
    // Add listeners for multiple auth events
    const authEvents = ['userLogin', 'authChange', 'roleChange', 'sessionUpdate'];
    authEvents.forEach(event => {
      window.addEventListener(event, handleAuthEvents);
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      authEvents.forEach(event => {
        window.removeEventListener(event, handleAuthEvents);
      });
    };
  }, []);

  return <AuthContext.Provider value={{ user, role }}>{children}</AuthContext.Provider>;
};