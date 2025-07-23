import React, { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RoleBasedNavigation from "./RoleBasedNavigation";
import SecureLogout from "./SecureLogout";
import { 
  LogOut,
  User,
  Menu,
  X,
  Home,
  Settings
} from "lucide-react";
// UserProfileDropdown removed per user request

interface MobileOptimizedLayoutProps {
  children: ReactNode;
}

const MobileOptimizedLayout = ({ children }: MobileOptimizedLayoutProps) => {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Proper desktop breakpoint - show desktop layout for standard desktop screens
      const width = window.innerWidth;
      setIsMobile(width < 768); // Only show mobile for actual mobile devices
      console.log(`[MobileOptimizedLayout] Screen width: ${width}px, Mobile mode: ${width < 768}`);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getCurrentUser = () => {
    const userStr = localStorage.getItem("lush_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getCurrentUser());
  const userRole = user?.role || 'client';

  // Listen for user changes
  useEffect(() => {
    const handleUserChange = () => {
      const freshUser = getCurrentUser();
      setUser(freshUser);
      setSidebarOpen(false);
    };

    window.addEventListener('userLogin', handleUserChange);
    window.addEventListener('roleChange', handleUserChange);
    window.addEventListener('logout', handleUserChange);
    window.addEventListener('storage', handleUserChange);
    
    return () => {
      window.removeEventListener('userLogin', handleUserChange);
      window.removeEventListener('roleChange', handleUserChange);
      window.removeEventListener('logout', handleUserChange);
      window.removeEventListener('storage', handleUserChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with User Profile */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* User Profile */}
            <div className="w-8 h-8 bg-[#007144] rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {userRole?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {userRole === 'admin' && 'Admin'}
                {userRole === 'builder' && 'Builder'}
                {userRole === 'client' && 'Client'}
                {userRole === 'investor' && 'Investor'}
                {userRole === 'accountant' && 'Accountant'}
              </div>
              <div className="text-xs text-gray-500">
                {userRole === 'admin' && 'admin@lush.com'}
                {userRole === 'builder' && 'builder@lush.com'}
                {userRole === 'client' && 'client@lush.com'}
                {userRole === 'investor' && 'investor@lush.com'}
                {userRole === 'accountant' && 'accountant@lush.com'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login';
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs">Logout</span>
            </button>
            
            {/* Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Header - Sticky with proper z-index */}
      {isMobile && (
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 min-h-[60px]">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007144] to-[#00a060] rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Lush Properties</h1>
                <p className="text-xs text-[#007144] font-medium">Pty Ltd</p>
              </div>
            </div>
            
            {/* Profile and Menu */}
            <div className="flex items-center gap-2">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-3 min-h-[48px] min-w-[48px] hover:bg-gray-100 transition-colors"
                  >
                    <Menu className="h-6 w-6 text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] p-0 bg-white">
                  {/* Mobile Navigation Content */}
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#007144] to-[#00a060]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-white">L</span>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">Menu</h2>
                          <p className="text-xs text-green-100">{userRole} Portal</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(false)}
                        className="text-white hover:bg-white/20 min-h-[44px] min-w-[44px] p-2"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <RoleBasedNavigation 
                        role={userRole} 
                        onNavigate={() => setSidebarOpen(false)}
                        mobile={true}
                      />
                    </div>
                    
                    {/* User Info and Logout */}
                    <div className="border-t p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg border">
                        <div className="w-10 h-10 bg-[#007144] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user?.email ? user.email[0].toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                              userRole === 'admin' || userRole === 'superadmin' ? 'bg-red-100 text-red-800 border-red-200' :
                              userRole === 'builder' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              userRole === 'client' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              userRole === 'investor' ? 'bg-green-100 text-green-800 border-green-200' :
                              userRole === 'accountant' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {userRole}
                            </div>
                          </div>
                        </div>
                      </div>
                      <SecureLogout className="w-full justify-center min-h-[44px] text-base font-medium" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <aside className="w-64 bg-white shadow-lg flex-shrink-0 overflow-y-auto border-r relative z-10">
            {/* User Profile Section */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#007144] rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {userRole?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {userRole === 'admin' && 'Administrator'}
                    {userRole === 'builder' && 'Builder'}
                    {userRole === 'client' && 'Client'}
                    {userRole === 'investor' && 'Investor'}
                    {userRole === 'accountant' && 'Accountant'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userRole === 'admin' && 'admin@lush.com'}
                    {userRole === 'builder' && 'builder@lush.com'}
                    {userRole === 'client' && 'client@lush.com'}
                    {userRole === 'investor' && 'investor@lush.com'}
                    {userRole === 'accountant' && 'accountant@lush.com'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4">
              <RoleBasedNavigation role={userRole} />
            </nav>
            
            {/* Logout Button */}
            <div className="p-4 border-t">
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </aside>
          
          {/* Desktop Main Content */}
          <main className="flex-1 overflow-auto bg-gray-50 relative">
            {/* User profile dropdown removed per user request */}
            <div className="p-6 lg:p-8 min-h-full">
              {children}
            </div>
          </main>
        </div>
      )}

      {/* Mobile Main Content */}
      {isMobile && (
        <main className="pb-6">
          <div className="p-4">
            {children}
          </div>
        </main>
      )}
    </div>
  );
};

export default MobileOptimizedLayout;