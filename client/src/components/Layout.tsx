import React, { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "./firebase";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const logout = async () => {
    await signOut(getAuth());
    navigate("/login");
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-green-700 text-white">
        <h1 className="font-bold text-xl">Lush Properties Control Center</h1>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/uploads" className="hover:underline">Uploads</Link>
          <Link to="/claims" className="hover:underline">Claims</Link>
          {role === "admin" && <Link to="/xero" className="hover:underline">Xero</Link>}
          <Button onClick={logout} variant="destructive" size="sm">
            Logout
          </Button>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;