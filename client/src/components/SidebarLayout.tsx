import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "./firebase";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  DollarSign, 
  Settings, 
  LogOut,
  User,
  Brain,
  TestTube,
  History,
  Building,
  Shield,
  Construction,
  PenTool
} from "lucide-react";

interface SidebarLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  
  const logout = async () => {
    await signOut(getAuth());
    navigate("/login");
  };

  const navItems: NavItem[] = [
    { 
      label: "Dashboard", 
      path: "/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      label: "Uploads", 
      path: "/uploads", 
      icon: <Upload className="h-5 w-5" /> 
    },
    { 
      label: "Smart Upload", 
      path: "/smart-upload", 
      icon: <Brain className="h-5 w-5" /> 
    },
    { 
      label: "Budget Analyzer", 
      path: "/budget-analyzer", 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      label: "Budget Test", 
      path: "/budget-test", 
      icon: <Brain className="h-5 w-5" /> 
    },
    { 
      label: "Claim Engine", 
      path: "/claim-engine", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      label: "Claim Test", 
      path: "/claim-test", 
      icon: <TestTube className="h-5 w-5" /> 
    },
    { 
      label: "Claim History", 
      path: "/claim-history", 
      icon: <History className="h-5 w-5" /> 
    },
    { 
      label: "Lender Simulator", 
      path: "/lender-simulator", 
      icon: <Building className="h-5 w-5" /> 
    },
    { 
      label: "Secure Panel", 
      path: "/secure-panel", 
      icon: <Shield className="h-5 w-5" /> 
    },
    { 
      label: "Builder Timeline", 
      path: "/builder-timeline", 
      icon: <Construction className="h-5 w-5" /> 
    },
    { 
      label: "Claim Dashboard", 
      path: "/claim-dashboard", 
      icon: <PenTool className="h-5 w-5" /> 
    },
    { 
      label: "Polished Dashboard", 
      path: "/polished-dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      label: "Clean Login", 
      path: "/login-clean", 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      label: "Enhanced Receipts", 
      path: "/enhanced-receipts", 
      icon: <Upload className="h-5 w-5" /> 
    },
    { 
      label: "Claims", 
      path: "/claims", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      label: "Xero", 
      path: "/xero", 
      icon: <DollarSign className="h-5 w-5" />,
      adminOnly: true 
    },
    { 
      label: "AI Workflows", 
      path: "/ai-workflows", 
      icon: <Brain className="h-5 w-5" /> 
    },
    { 
      label: "Role Dashboard", 
      path: "/role-dashboard", 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      label: "Role Manager", 
      path: "/admin/role-manager", 
      icon: <User className="h-5 w-5" />,
      adminOnly: true 
    },
    { 
      label: "Settings", 
      path: "/settings", 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || role === "admin"
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-green-700">Lush Properties Control Center</h1>
          <p className="text-sm text-gray-600 mt-1">Premium Projects. Powerful Returns.</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t">
          <Card className="p-3 mb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.email || "Demo User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {role || "Loading..."}
                </p>
              </div>
            </div>
          </Card>
          
          <Button 
            onClick={logout} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;