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
import ClaimEngine from "./components/ClaimEngine";
import ClaimTestDemo from "./components/ClaimTestDemo";
import ClaimHistory from "./components/ClaimHistory";
import LenderResponseSimulator from "./components/LenderResponseSimulator";
import SecureProjectPanel from "./components/SecureProjectPanel";
import BuilderTimeline from "./components/BuilderTimeline";
import ClaimDashboard from "./components/ClaimDashboard";
import PolishedDashboard from "./components/PolishedDashboard";
import EnhancedReceiptUpload from "./components/EnhancedReceiptUpload";
import RoleLoginTester from "./components/RoleLoginTester";
import WorkingLogin from "./components/WorkingLogin";
import ResponsiveLayout from "./components/ResponsiveLayout";
import PolishedBuilderPortal from "./components/PolishedBuilderPortal";
import PolishedClientPortal from "./components/PolishedClientPortal";
import FloatingAIChat from "./components/FloatingAIChat";
import ClientOnboarding from "./components/ClientOnboarding";
import SecurityPanel from "./components/SecurityPanel";
import InviteClientModal from "./components/InviteClientModal";
import WalkthroughGuide from "./components/WalkthroughGuide";
import RoleBasedNavigation from "./components/RoleBasedNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteGuard from "./components/RouteGuard";
import ClientDashboard from "./components/ClientDashboard";
import FinanceDashboard from "./components/FinanceDashboard";
import InvestorDashboard from "./components/InvestorDashboard";
import RoleFlowTester from "./components/RoleFlowTester";
import ManualRoleTester from "./components/ManualRoleTester";
import LoginTester from "./components/LoginTester";
import BuilderDebugTest from "./components/BuilderDebugTest";
import RoleSystemTester from "./components/RoleSystemTester";
import ErrorDiagnostics from "./components/ErrorDiagnostics";
import QuickRoleFixer from "./components/QuickRoleFixer";

interface AuthProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const AuthProtectedRoute = ({ children, role }: AuthProtectedRouteProps) => {
  const { user, role: userRole } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/unauthorized" />;
  return <>{children}</>;
};



function App() {
  // Get current user from localStorage for role-based routing
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("lush_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  };
  
  const user = getCurrentUser();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MobileEnhancer>
            <CompactWrapper>
              <Router>
                <Routes>
                  <Route path="/login" element={<WorkingLogin />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/magic/:token" element={<MagicLogin />} />
                  <Route path="/unauthorized" element={<div className="p-8 text-center">Unauthorized Access</div>} />
                  <Route
                    path="/*"
                    element={
                      <AuthProtectedRoute>
                        <ResponsiveLayout>
                          <Routes>
                            <Route path="dashboard" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                {window.innerWidth < 768 ? <MobileDashboard /> : <Dashboard />}
                              </RouteGuard>
                            } />
                            <Route path="mobile" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <MobileDashboard />
                              </RouteGuard>
                            } />
                            <Route path="uploads" element={
                              <RouteGuard allowedRoles={['builder', 'client', 'admin']} userRole={user?.role}>
                                <Upload />
                              </RouteGuard>
                            } />
                            <Route path="smart-upload" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={user?.role}>
                                <SmartReceiptUpload />
                              </RouteGuard>
                            } />
                            <Route path="budget-analyzer" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={user?.role}>
                                <ReceiptAnalyzer />
                              </RouteGuard>
                            } />
                            <Route path="budget-test" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <BudgetTestDemo />
                              </RouteGuard>
                            } />
                            <Route path="claim-engine" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={user?.role}>
                                <ClaimEngine />
                              </RouteGuard>
                            } />
                            <Route path="claim-test" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <ClaimTestDemo />
                              </RouteGuard>
                            } />
                            <Route path="claim-history" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={user?.role}>
                                <ClaimHistory />
                              </RouteGuard>
                            } />
                            <Route path="lender-simulator" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <LenderResponseSimulator />
                              </RouteGuard>
                            } />
                            <Route path="secure-panel" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={user?.role}>
                                <SecureProjectPanel 
                              user={{
                                id: "user123",
                                email: "builder@lush.com",
                                role: "builder",
                                token: "jwt_token_sample_123456789",
                                permissions: ["UPLOAD", "VIEW_PROJECT", "SUBMIT_CLAIMS"],
                                lastActivity: new Date().toISOString()
                              }}
                              project={{
                                id: "proj-001",
                                name: "Luxury Townhouse Development",
                                status: "In Progress"
                              }}
                            />
                              </RouteGuard>
                            } />
                            <Route path="builder-timeline" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={user?.role}>
                                <BuilderTimeline 
                                  project={{
                                    id: "proj-001",
                                    name: "Luxury Townhouse Development",
                                    status: "In Progress"
                                  }}
                                  user={{
                                    id: "user123",
                                    email: "builder@lush.com",
                                    role: "builder"
                                  }}
                                />
                              </RouteGuard>
                            } />
                            <Route path="claim-dashboard" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={user?.role}>
                                <ClaimDashboard />
                              </RouteGuard>
                            } />
                            <Route path="polished-dashboard" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <PolishedDashboard 
                                  user={{
                                    id: "user123",
                                    firstName: "John",
                                    lastName: "Builder", 
                                    email: "john@lush.com",
                                    role: "admin"
                                  }}
                                  projects={[
                                    {
                                      id: "proj-001",
                                      name: "Luxury Townhouse Development",
                                      address: "123 Oak Street, Melbourne VIC",
                                      status: "in-progress",
                                      stage: "Framing",
                                      amount: 2450000,
                                      progress: 73,
                                      nextMilestone: "Lockup Complete",
                                      daysUntilMilestone: 12
                                    },
                                    {
                                      id: "proj-002", 
                                      name: "Modern Villa Project",
                                      address: "456 Pine Avenue, Sydney NSW",
                                      status: "in-progress",
                                      stage: "Foundation",
                                      amount: 3200000,
                                      progress: 45,
                                      nextMilestone: "Frame Start",
                                      daysUntilMilestone: 8
                                    },
                                    {
                                      id: "proj-003",
                                      name: "Garden Apartments",
                                      address: "789 Elm Drive, Brisbane QLD", 
                                      status: "completed",
                                      stage: "Handover",
                                      amount: 1800000,
                                      progress: 100,
                                      nextMilestone: "Final Inspection",
                                      daysUntilMilestone: 3
                                    }
                                  ]}
                                />
                              </RouteGuard>
                            } />
                            <Route path="login-clean" element={<Login onLogin={async (email, password) => {
                              console.log('Clean login attempt:', { email });
                              // Mock successful login
                              await new Promise(resolve => setTimeout(resolve, 1000));
                              alert('Login successful! Clean interface demo.');
                            }} />} />
                            <Route path="role-login-tester" element={
                              <div className="p-8">
                                <RoleLoginTester />
                              </div>
                            } />
                            <Route path="working-login" element={<WorkingLogin />} />
                            <Route path="enhanced-receipts" element={<EnhancedReceiptUpload 
                              projectId="proj-001"
                              onUploadComplete={(uploads) => {
                                console.log('Upload completed:', uploads);
                                window.dispatchEvent(new CustomEvent('uploadComplete', {
                                  detail: { message: `${uploads.length} receipt(s) processed successfully` }
                                }));
                              }}
                            />} />
                            <Route path="claims" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={user?.role}>
                                <Claims />
                              </RouteGuard>
                            } />
                            <Route path="xero" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={user?.role}>
                                <Xero />
                              </RouteGuard>
                            } />
                            <Route path="settings" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <Settings />
                              </RouteGuard>
                            } />
                            <Route path="contracts" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <ContractUpload />
                              </RouteGuard>
                            } />
                            <Route path="profits" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <ProfitCalculator />
                              </RouteGuard>
                            } />
                            <Route path="builder" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={user?.role}>
                                <PolishedBuilderPortal />
                              </RouteGuard>
                            } />
                            <Route path="client-upgrades" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={user?.role}>
                                <ClientUpgradePanel />
                              </RouteGuard>
                            } />
                            <Route path="client-portal" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={user?.role}>
                                <PolishedClientPortal />
                              </RouteGuard>
                            } />
                            <Route path="client" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={user?.role}>
                                <ClientDashboard />
                              </RouteGuard>
                            } />
                            <Route path="finance" element={
                              <RouteGuard allowedRoles={['accountant', 'admin']} userRole={user?.role}>
                                <FinanceDashboard />
                              </RouteGuard>
                            } />
                            <Route path="client-onboarding" element={<ClientOnboarding onComplete={() => window.location.href = '/client-portal'} />} />
                            <Route path="security" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <SecurityPanel />
                              </RouteGuard>
                            } />
                            <Route path="walkthrough" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <WalkthroughGuide isActive={true} onClose={() => window.location.href = '/dashboard'} />
                              </RouteGuard>
                            } />
                            <Route path="investor" element={
                              <RouteGuard allowedRoles={['investor', 'admin']} userRole={user?.role}>
                                <InvestorDashboard />
                              </RouteGuard>
                            } />
                            <Route path="heatmap" element={
                              <RouteGuard allowedRoles={['investor', 'admin']} userRole={user?.role}>
                                <HeatmapVisualizer />
                              </RouteGuard>
                            } />
                            <Route path="ai-workflows" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <AIWorkflowEngine />
                              </RouteGuard>
                            } />
                            <Route path="role-dashboard" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <RoleBasedDashboard />
                              </RouteGuard>
                            } />
                            <Route path="admin/role-manager" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <AdminRoleManager />
                              </RouteGuard>
                            } />
                            <Route path="invite/:token" element={<InviteAcceptance />} />
                            <Route path="project-view" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={user?.role}>
                                <RoleBasedDashboard />
                              </RouteGuard>
                            } />
                            <Route path="investor-portal" element={
                              <RouteGuard allowedRoles={['investor', 'admin']} userRole={user?.role}>
                                <HeatmapVisualizer />
                              </RouteGuard>
                            } />
                            <Route path="role-flow-tester" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <RoleFlowTester />
                              </RouteGuard>
                            } />
                            <Route path="manual-role-tester" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <ManualRoleTester />
                              </RouteGuard>
                            } />
                            <Route path="login-tester" element={
                              <RouteGuard allowedRoles={['admin']} userRole={user?.role}>
                                <LoginTester />
                              </RouteGuard>
                            } />
                            <Route path="builder-debug" element={<BuilderDebugTest />} />
                            <Route path="role-system-test" element={<RoleSystemTester />} />
                            <Route path="error-diagnostics" element={<ErrorDiagnostics />} />
                            <Route path="quick-role-fix" element={<QuickRoleFixer />} />
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                          </Routes>
                          <AIChatWidget />
                          <FloatingAIChat />
                          <MobileNotifications />
                        </ResponsiveLayout>
                      </AuthProtectedRoute>
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
