import React, { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RoleBasedNavigation from "./RoleBasedNavigation";
import SecureLogout from "./SecureLogout";
import { 
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";

interface ResponsiveLayoutProps {
  children: ReactNode;
}



const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Get current user role with fresh data on every render
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("lush_user");
    if (!userStr) return null;
    try {
      const userData = JSON.parse(userStr);
      console.log('[LAYOUT] Fresh user data loaded:', userData.role);
      return userData;
    } catch {
      console.log('[LAYOUT] Failed to parse user data');
      return null;
    }
  };

  const [user, setUser] = useState(getCurrentUser());
  const userRole = user?.role || 'client';

  // Listen for user changes to refresh layout and reset sidebar state
  useEffect(() => {
    const handleUserChange = () => {
      const freshUser = getCurrentUser();
      setUser(freshUser);
      setSidebarOpen(false); // Reset sidebar state on user change
      console.log('[LAYOUT] User changed, refreshing layout for role:', freshUser?.role);
    };

    const handleLogout = () => {
      setUser(null);
      setSidebarOpen(false);
      console.log('[LAYOUT] Logout detected, clearing user and resetting sidebar');
    };

    window.addEventListener('userLogin', handleUserChange);
    window.addEventListener('roleChange', handleUserChange);
    window.addEventListener('logout', handleLogout);
    window.addEventListener('storage', handleUserChange);
    
    return () => {
      window.removeEventListener('userLogin', handleUserChange);
      window.removeEventListener('roleChange', handleUserChange);
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('storage', handleUserChange);
    };
  }, []);

  // Force fresh role check on navigation changes
  useEffect(() => {
    const freshUser = getCurrentUser();
    if (freshUser && (!user || user.role !== freshUser.role)) {
      setUser(freshUser);
      console.log('[LAYOUT] Navigation change detected, refreshing user role:', freshUser.role);
    }
  }, [location]);

  // Logout is now handled by SecureLogout component

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-6'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 mb-8 ${mobile ? 'pb-4 border-b' : ''}`}>
        <div className={`bg-gradient-to-br from-lush-primary to-lush-accent rounded-xl flex items-center justify-center shadow-lg ${mobile ? 'w-10 h-10' : 'w-12 h-12'}`}>
          <span className={`font-bold text-white ${mobile ? 'text-lg' : 'text-xl'}`}>L</span>
        </div>
        <div className={mobile ? 'block' : 'hidden lg:block'}>
          <h1 className={`font-bold text-gray-900 leading-tight ${mobile ? 'text-base' : 'text-lg'}`}>
            Lush Properties
          </h1>
          <p className={`text-lush-primary font-medium ${mobile ? 'text-xs' : 'text-sm'}`}>
            Pty Ltd
          </p>
        </div>
      </div>

      {/* Role-Based Navigation */}
      <div className="flex-1">
        <RoleBasedNavigation userRole={userRole} isCollapsed={false} />
      </div>

      {/* User Profile & Logout */}
      <div className={`border-t pt-4 mt-4 ${mobile ? 'space-y-3' : 'space-y-2'}`}>
        <div className={`flex items-center gap-3 px-4 py-2 ${mobile ? '' : 'hidden lg:flex'}`}>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">User</p>
            <p className="text-xs text-gray-500 truncate">admin@lush.com</p>
          </div>
        </div>
        
        <SecureLogout 
          variant="text" 
          className={`w-full justify-start gap-3 ${mobile ? 'h-12 text-base' : 'h-10'}`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-lush-primary to-lush-accent rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">L</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Lush Properties</h1>
              <p className="text-xs text-lush-primary font-medium">Pty Ltd</p>
            </div>
          </div>
          
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 min-h-[48px] min-w-[48px]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <NavContent mobile={true} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 bg-white border-r min-h-screen sticky top-0">
          <NavContent />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 main-content" role="main">
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto content-transition entered">
            {children}
          </div>
        </main>
      </div>


      
      {/* Add bottom padding for PWA install button */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
};

export default ResponsiveLayout;