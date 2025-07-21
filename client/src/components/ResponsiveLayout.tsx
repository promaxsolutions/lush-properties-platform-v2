import React, { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RoleBasedNavigation from "./RoleBasedNavigation";
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

  // Get current user role
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("lush_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();
  const userRole = user?.role || 'client';

  const logout = () => {
    localStorage.removeItem("lush_user");
    navigate("/login");
  };

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
        
        <Button
          onClick={logout}
          variant="ghost"
          className={`w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 ${mobile ? 'h-12 text-base' : 'h-10'}`}
        >
          <LogOut className="h-5 w-5" />
          <span className={mobile ? 'block' : 'hidden lg:block'}>Logout</span>
        </Button>
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
        <div className="flex-1 min-w-0">
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>


      
      {/* Add bottom padding for PWA install button */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
};

export default ResponsiveLayout;