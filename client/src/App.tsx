import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./components/Login";
import Register from "./components/Register";
import LushDashboard from "./components/lush-dashboard";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Upload from "./components/Upload";
import Claims from "./components/Claims";
import Xero from "./components/Xero";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, role: userRole } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<div className="p-8 text-center">Unauthorized Access</div>} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="dashboard" element={<LushDashboard />} />
                        <Route path="uploads" element={<Upload />} />
                        <Route path="claims" element={<Claims />} />
                        <Route 
                          path="xero" 
                          element={
                            <ProtectedRoute role="admin">
                              <Xero />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
