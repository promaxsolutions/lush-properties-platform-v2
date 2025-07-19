import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged } from "./firebase";

interface User {
  email: string | null;
  uid: string;
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
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      // Simulate role lookup, replace with DB call later
      if (firebaseUser?.email === "david@example.com") setRole("broker");
      else if (firebaseUser?.email === "nowa@example.com") setRole("solicitor");
      else setRole("admin");
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, role }}>{children}</AuthContext.Provider>;
};