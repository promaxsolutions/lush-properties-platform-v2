import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/lush-dashboard";
import MobileDashboard from "./components/MobileDashboard";
import SidebarLayout from "./components/SidebarLayout";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Upload from "./components/Upload";
import Claims from "./components/Claims";
import Xero from "./components/Xero";
import Settings from "./components/Settings";
import AIChatWidget from "./components/AIChatWidget";
import ContractUpload from "./components/ContractUpload";
import ProfitCalculator from "./components/ProfitCalculator";
import BuilderPortal from "./components/BuilderPortal";
import ClientUpgradePanel from "./components/ClientUpgradePanel";
import HeatmapVisualizer from "./components/HeatmapVisualizer";
import AIWorkflowEngine from "./components/AIWorkflowEngine";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import AdminRoleManager from "./components/AdminRoleManager";
import InviteAcceptance from "./components/InviteAcceptance";
import MagicLogin from "./components/MagicLogin";
import MobileEnhancer from "./components/MobileEnhancer";
import CompactWrapper from "./components/CompactWrapper";
import SmartReceiptUpload from "./components/SmartReceiptUpload";
import MobileNotifications from "./components/MobileNotifications";
import ReceiptAnalyzer from "./components/ReceiptAnalyzer";
import BudgetTestDemo from "./components/BudgetTestDemo";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, role: userRole } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/unauthorized" />;
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MobileEnhancer>
            <CompactWrapper>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/magic/:token" element={<MagicLogin />} />
                  <Route path="/unauthorized" element={<div className="p-8 text-center">Unauthorized Access</div>} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <SidebarLayout>
                          <Routes>
                            <Route path="dashboard" element={
                              window.innerWidth < 768 ? <MobileDashboard /> : <Dashboard />
                            } />
                            <Route path="mobile" element={<MobileDashboard />} />
                            <Route path="uploads" element={<Upload />} />
                            <Route path="smart-upload" element={<SmartReceiptUpload />} />
                            <Route path="budget-analyzer" element={<ReceiptAnalyzer />} />
                            <Route path="budget-test" element={<BudgetTestDemo />} />
                            <Route path="claims" element={<Claims />} />
                            <Route path="xero" element={<Xero />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="contracts" element={<ContractUpload />} />
                            <Route path="profits" element={<ProfitCalculator />} />
                            <Route path="builder" element={<BuilderPortal />} />
                            <Route path="client-upgrades" element={<ClientUpgradePanel />} />
                            <Route path="heatmap" element={<HeatmapVisualizer />} />
                            <Route path="ai-workflows" element={<AIWorkflowEngine />} />
                            <Route path="role-dashboard" element={<RoleBasedDashboard />} />
                            <Route path="admin/role-manager" element={<AdminRoleManager />} />
                            <Route path="invite/:token" element={<InviteAcceptance />} />
                            <Route path="project-view" element={<RoleBasedDashboard />} />
                            <Route path="investor-portal" element={<HeatmapVisualizer />} />
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                          </Routes>
                          <AIChatWidget />
                          <MobileNotifications />
                        </SidebarLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </CompactWrapper>
          </MobileEnhancer>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
