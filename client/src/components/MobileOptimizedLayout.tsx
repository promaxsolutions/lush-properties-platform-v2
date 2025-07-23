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

interface MobileOptimizedLayoutProps {
  children: ReactNode;
}

const MobileOptimizedLayout = ({ children }: MobileOptimizedLayoutProps) => {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
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
            
            {/* Role Badge and Menu */}
            <div className="flex items-center gap-2">
              <div className="text-xs bg-[#007144]/10 text-[#007144] px-3 py-1.5 rounded-full font-medium border border-[#007144]/20">
                {userRole}
              </div>
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
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
                          <p className="text-xs text-gray-500 capitalize">{userRole} Access</p>
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
          <aside className="w-64 bg-white shadow-lg flex-shrink-0 overflow-y-auto border-r">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007144] to-[#00a060] rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-xl font-bold text-white">L</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Lush Properties</h1>
                  <p className="text-sm text-[#007144] font-medium">Pty Ltd</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Premium Projects. Powerful Returns.</p>
            </div>
            <nav className="p-4">
              <RoleBasedNavigation role={userRole} />
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-3 mb-4 px-3 py-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                </div>
                <SecureLogout className="w-full" />
              </div>
            </nav>
          </aside>
          
          {/* Desktop Main Content */}
          <main className="flex-1 overflow-auto bg-gray-50">
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