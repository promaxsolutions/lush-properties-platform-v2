import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastContainer } from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/lush-dashboard";
import MobileDashboard from "./components/MobileDashboard";
import ResponsiveDashboard from "./components/ResponsiveDashboard";
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
import MobileOptimizedLayout from "./components/MobileOptimizedLayout";
import PolishedBuilderPortal from "./components/PolishedBuilderPortal";
import PolishedClientPortal from "./components/PolishedClientPortal";
import FloatingAIChat from "./components/FloatingAIChat";
import AccessibilityEnhancer from "./components/AccessibilityEnhancer";
import ClientOnboarding from "./components/ClientOnboarding";
import SecurityPanel from "./components/SecurityPanel";
import InviteClientModal from "./components/InviteClientModal";
import WalkthroughGuide from "./components/WalkthroughGuide";
import RoleBasedNavigation from "./components/RoleBasedNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteGuard from "./components/RouteGuard";
import EnhancedRouteGuard from "./components/EnhancedRouteGuard";
import AccessDeniedPage from "./components/AccessDeniedPage";
import ComprehensiveLoginAudit from "./components/ComprehensiveLoginAudit";
import SmoothScrollWrapper from "./components/SmoothScrollWrapper";
import AdminUserList from "./components/AdminUserList";
import UserDetailView from "./components/UserDetailView";
import ImpersonationBanner from "./components/ImpersonationBanner";
import PortalPreview from "./components/PortalPreview";
import ImpersonateUser from "./components/ImpersonateUser";
import AdminAuditPanel from "./components/AdminAuditPanel";
import NavigationTester from "./components/NavigationTester";
import ComprehensiveNavigationValidator from "./components/ComprehensiveNavigationValidator";
import CredentialValidator from "./components/CredentialValidator";
import ClientDashboard from "./components/ClientDashboard";
import FinanceDashboard from "./components/FinanceDashboard";
import InvestorDashboard from "./components/InvestorDashboard";
import RoleFlowTester from "./components/RoleFlowTester";
import ManualRoleTester from "./components/ManualRoleTester";
import LoginTester from "./components/LoginTester";
import ComprehensiveRoleTester from "./components/ComprehensiveRoleTester";
import EnhancedRouteHandler from "./components/EnhancedRouteHandler";
import RouteTestingUtility from "./components/RouteTestingUtility";
import BuilderDebugTest from "./components/BuilderDebugTest";
import RoleSystemTester from "./components/RoleSystemTester";
import ErrorDiagnostics from "./components/ErrorDiagnostics";
import QuickRoleFixer from "./components/QuickRoleFixer";
import AuthSyncHandler from "./components/AuthSyncHandler";
import InvestorRoleFixer from "./components/InvestorRoleFixer";

import MobilePWAInstaller from "./components/MobilePWAInstaller";
import MobileTestingGuide from "./components/MobileTestingGuide";
import PWAInstaller from "./components/PWAInstaller";
import EnhancedDashboard from "./components/EnhancedDashboard";

import SmartNotifications from "./components/SmartNotifications";
import SystemHealthMonitor from "./components/SystemHealthMonitor";
import QuickActions from "./components/QuickActions";

interface AuthProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const AuthProtectedRoute = ({ children, role }: AuthProtectedRouteProps) => {
  const { user, role: userRole } = useAuth();
  
  // Check both AuthContext and localStorage for user data
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("lush_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  };
  
  const currentUser = user || getCurrentUser();
  const currentRole = userRole || currentUser?.role;
  
  if (!currentUser) return <Navigate to="/login" />;
  if (role && currentRole !== role) return <Navigate to="/unauthorized" />;
  return <>{children}</>;
};

// Fallback router component to redirect users to correct dashboard
const FallbackRouter = ({ userRole }: { userRole?: string }) => {
  const dashboardRoutes: Record<string, string> = {
    admin: '/dashboard',
    builder: '/builder',
    client: '/client',
    accountant: '/finance',
    investor: '/investor'
  };
  
  const targetRoute = userRole ? dashboardRoutes[userRole] || '/dashboard' : '/login';
  console.log(`[FALLBACK] Redirecting ${userRole || 'unknown'} to ${targetRoute}`);
  
  return <Navigate to={targetRoute} replace />;
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
  const { user: authUser } = useAuth();
  const { toasts, removeToast } = useToast();
  
  // Use either auth context user or localStorage user
  const currentUser = authUser || user;
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SmoothScrollWrapper>
            <MobileEnhancer>
              <CompactWrapper>
                <Router>
                  <Routes>
                  <Route path="/login" element={<WorkingLogin />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/magic/:token" element={<MagicLogin />} />
                  <Route path="/unauthorized" element={<AccessDeniedPage />} />
                  <Route
                    path="/*"
                    element={
                      <AuthProtectedRoute>
                        <MobileOptimizedLayout>
                          <Routes>
                            <Route path="dashboard" element={
                              <RouteGuard allowedRoles={['admin', 'superadmin']} userRole={currentUser?.role}>
                                <ResponsiveDashboard />
                              </RouteGuard>
                            } />
                            <Route path="builder" element={
                              <RouteGuard allowedRoles={['builder', 'admin', 'superadmin']} userRole={currentUser?.role}>
                                <PolishedBuilderPortal />
                              </RouteGuard>
                            } />
                            <Route path="client" element={
                              <RouteGuard allowedRoles={['client', 'admin', 'superadmin']} userRole={currentUser?.role}>
                                <ClientDashboard />
                              </RouteGuard>
                            } />
                            <Route path="finance" element={
                              <RouteGuard allowedRoles={['accountant', 'admin', 'superadmin']} userRole={currentUser?.role}>
                                <FinanceDashboard />
                              </RouteGuard>
                            } />
                            <Route path="users" element={
                              <RouteGuard allowedRoles={['admin', 'superadmin']} userRole={currentUser?.role}>
                                <AdminUserList />
                              </RouteGuard>
                            } />
                            <Route path="mobile" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <MobileDashboard />
                              </RouteGuard>
                            } />
                            <Route path="uploads" element={
                              <RouteGuard allowedRoles={['builder', 'client', 'admin']} userRole={currentUser?.role}>
                                <Upload />
                              </RouteGuard>
                            } />
                            <Route path="smart-upload" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={currentUser?.role}>
                                <SmartReceiptUpload />
                              </RouteGuard>
                            } />
                            <Route path="budget-analyzer" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={currentUser?.role}>
                                <ReceiptAnalyzer />
                              </RouteGuard>
                            } />
                            <Route path="budget-test" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <BudgetTestDemo />
                              </RouteGuard>
                            } />
                            <Route path="claim-engine" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={currentUser?.role}>
                                <ClaimEngine />
                              </RouteGuard>
                            } />
                            <Route path="claim-test" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <ClaimTestDemo />
                              </RouteGuard>
                            } />
                            <Route path="claim-history" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={currentUser?.role}>
                                <ClaimHistory />
                              </RouteGuard>
                            } />
                            <Route path="lender-simulator" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <LenderResponseSimulator />
                              </RouteGuard>
                            } />
                            <Route path="secure-panel" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={currentUser?.role}>
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
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={currentUser?.role}>
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
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={currentUser?.role}>
                                <ClaimDashboard />
                              </RouteGuard>
                            } />
                            <Route path="polished-dashboard" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
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
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={currentUser?.role}>
                                <Claims />
                              </RouteGuard>
                            } />
                            <Route path="xero" element={
                              <RouteGuard allowedRoles={['admin', 'accountant']} userRole={currentUser?.role}>
                                <Xero />
                              </RouteGuard>
                            } />
                            <Route path="settings" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <Settings />
                              </RouteGuard>
                            } />
                            <Route path="contracts" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <ContractUpload />
                              </RouteGuard>
                            } />
                            <Route path="profits" element={
                              <RouteGuard allowedRoles={['admin', 'superadmin']} userRole={currentUser?.role}>
                                <ProfitCalculator />
                              </RouteGuard>
                            } />
                            <Route path="builder" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={currentUser?.role}>
                                <PolishedBuilderPortal />
                              </RouteGuard>
                            } />
                            <Route path="client-upgrades" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={currentUser?.role}>
                                <ClientUpgradePanel />
                              </RouteGuard>
                            } />
                            <Route path="client-portal" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={currentUser?.role}>
                                <PolishedClientPortal />
                              </RouteGuard>
                            } />
                            <Route path="client" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={currentUser?.role}>
                                <ClientDashboard />
                              </RouteGuard>
                            } />
                            <Route path="finance" element={
                              <RouteGuard allowedRoles={['accountant', 'admin']} userRole={currentUser?.role}>
                                <FinanceDashboard />
                              </RouteGuard>
                            } />
                            <Route path="client-onboarding" element={<ClientOnboarding onComplete={() => window.location.href = '/client-portal'} />} />
                            <Route path="security" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <SecurityPanel />
                              </RouteGuard>
                            } />
                            <Route path="walkthrough" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <WalkthroughGuide isActive={true} onClose={() => window.location.href = '/dashboard'} />
                              </RouteGuard>
                            } />
                            <Route path="investor" element={
                              <RouteGuard allowedRoles={['investor', 'admin']} userRole={currentUser?.role}>
                                <InvestorDashboard />
                              </RouteGuard>
                            } />
                            <Route path="heatmap" element={
                              <RouteGuard allowedRoles={['investor', 'admin']} userRole={currentUser?.role}>
                                <HeatmapVisualizer />
                              </RouteGuard>
                            } />
                            <Route path="ai-workflows" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <AIWorkflowEngine />
                              </RouteGuard>
                            } />
                            <Route path="role-dashboard" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <RoleBasedDashboard />
                              </RouteGuard>
                            } />
                            <Route path="admin/role-manager" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <AdminRoleManager />
                              </RouteGuard>
                            } />
                            <Route path="invite/:token" element={<InviteAcceptance />} />
                            <Route path="project-view" element={
                              <RouteGuard allowedRoles={['client', 'admin']} userRole={currentUser?.role}>
                                <RoleBasedDashboard />
                              </RouteGuard>
                            } />
                            <Route path="investor-portal" element={
                              <RouteGuard allowedRoles={['investor', 'admin']} userRole={currentUser?.role}>
                                <HeatmapVisualizer />
                              </RouteGuard>
                            } />
                            <Route path="role-flow-tester" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <RoleFlowTester />
                              </RouteGuard>
                            } />
                            <Route path="manual-role-tester" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <ManualRoleTester />
                              </RouteGuard>
                            } />
                            <Route path="login-tester" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <LoginTester />
                              </RouteGuard>
                            } />
                            <Route path="comprehensive-test" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <ComprehensiveRoleTester />
                              </RouteGuard>
                            } />
                            <Route path="route-test" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <RouteTestingUtility />
                              </RouteGuard>
                            } />
                            <Route path="builder-debug" element={<BuilderDebugTest />} />
                            <Route path="role-system-test" element={<RoleSystemTester />} />
                            <Route path="error-diagnostics" element={<ErrorDiagnostics />} />
                            <Route path="quick-role-fix" element={<QuickRoleFixer />} />
                            <Route path="mobile-test" element={<MobileTestingGuide />} />
                            <Route path="audit" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <AdminAuditPanel />
                              </RouteGuard>
                            } />
                            <Route path="nav-test" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <NavigationTester />
                              </RouteGuard>
                            } />
                            <Route path="nav-validator" element={
                              <RouteGuard allowedRoles={['admin', 'superadmin']} userRole={currentUser?.role}>
                                <ComprehensiveNavigationValidator />
                              </RouteGuard>
                            } />
                            <Route path="credential-test" element={
                              <RouteGuard allowedRoles={['admin', 'superadmin']} userRole={currentUser?.role}>
                                <CredentialValidator />
                              </RouteGuard>
                            } />
                            {/* Missing routes - add all navigation paths */}
                            <Route path="uploads" element={
                              <RouteGuard allowedRoles={['builder', 'client', 'admin']} userRole={currentUser?.role}>
                                <div className="p-8 text-center">
                                  <h2 className="text-2xl font-bold mb-4">Upload Center</h2>
                                  <p>Role-specific upload functionality coming soon...</p>
                                </div>
                              </RouteGuard>
                            } />
                            <Route path="timeline" element={
                              <RouteGuard allowedRoles={['builder', 'admin']} userRole={currentUser?.role}>
                                <div className="p-8 text-center">
                                  <h2 className="text-2xl font-bold mb-4">Project Timeline</h2>
                                  <p>Builder timeline view coming soon...</p>
                                </div>
                              </RouteGuard>
                            } />
                            <Route path="documents" element={
                              <RouteGuard allowedRoles={['client', 'investor', 'admin']} userRole={currentUser?.role}>
                                <div className="p-8 text-center">
                                  <h2 className="text-2xl font-bold mb-4">My Documents</h2>
                                  <p>Document management coming soon...</p>
                                </div>
                              </RouteGuard>
                            } />
                            <Route path="receipts" element={
                              <RouteGuard allowedRoles={['accountant', 'admin']} userRole={currentUser?.role}>
                                <div className="p-8 text-center">
                                  <h2 className="text-2xl font-bold mb-4">Receipt Management</h2>
                                  <p>Receipt processing system coming soon...</p>
                                </div>
                              </RouteGuard>
                            } />
                            <Route path="users" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <AdminUserList />
                              </RouteGuard>
                            } />
                            <Route path="users/:userId" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <UserDetailView />
                              </RouteGuard>
                            } />
                            <Route path="portal/:role/:userId" element={
                              <RouteGuard allowedRoles={['admin']} userRole={currentUser?.role}>
                                <PortalPreview />
                              </RouteGuard>
                            } />
                            <Route path="impersonate/:userId" element={
                              <RouteGuard allowedRoles={['admin', 'superadmin']} userRole={currentUser?.role}>
                                <ImpersonateUser />
                              </RouteGuard>
                            } />
                            {/* Fallback routing based on user role */}
                            <Route path="*" element={
                              <FallbackRouter userRole={currentUser?.role} />
                            } />
                          </Routes>
                          <AuthSyncHandler />
                          <EnhancedRouteHandler userRole={currentUser?.role} />


                          <FloatingAIChat />
                          <QuickActions userRole={currentUser?.role || 'client'} />
                          <AccessibilityEnhancer />
                          <SmartNotifications />
                          <MobileNotifications />
                          <MobilePWAInstaller />
                          <PWAInstaller />
                          <SystemHealthMonitor />
                          <ImpersonationBanner />
                        </MobileOptimizedLayout>
                      </AuthProtectedRoute>
                    }
                  />
                  </Routes>
                </Router>
              </CompactWrapper>
            </MobileEnhancer>
          </SmoothScrollWrapper>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
