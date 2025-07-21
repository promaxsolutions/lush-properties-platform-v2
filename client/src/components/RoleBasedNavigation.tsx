import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Settings,
  Upload,
  Calendar,
  MessageCircle,
  TrendingUp,
  Receipt,
  Building,
  Home,
  CreditCard
} from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

interface RoleBasedNavigationProps {
  userRole: string;
  isCollapsed?: boolean;
}

const navigationItems: NavigationItem[] = [
  // Admin-only items
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['admin']
  },
  {
    path: '/users',
    label: 'User Management',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin']
  },
  {
    path: '/security',
    label: 'Security',
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin']
  },
  {
    path: '/walkthrough',
    label: 'Walkthrough',
    icon: <FileText className="h-5 w-5" />,
    roles: ['admin']
  },

  // Builder items
  {
    path: '/builder',
    label: 'Builder Portal',
    icon: <Building className="h-5 w-5" />,
    roles: ['builder', 'admin']
  },
  {
    path: '/uploads',
    label: 'Upload Progress',
    icon: <Upload className="h-5 w-5" />,
    roles: ['builder', 'admin']
  },
  {
    path: '/timeline',
    label: 'Project Timeline',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['builder', 'admin']
  },
  {
    path: '/claims',
    label: 'Payment Claims',
    icon: <DollarSign className="h-5 w-5" />,
    roles: ['builder', 'admin']
  },

  // Client items
  {
    path: '/client',
    label: 'My Project',
    icon: <Home className="h-5 w-5" />,
    roles: ['client', 'admin']
  },
  {
    path: '/client-upgrades',
    label: 'Upgrade Requests',
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ['client', 'admin']
  },
  {
    path: '/messages',
    label: 'Messages',
    icon: <MessageCircle className="h-5 w-5" />,
    roles: ['client', 'admin']
  },

  // Accountant items
  {
    path: '/finance',
    label: 'Finance Dashboard',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['accountant', 'admin']
  },
  {
    path: '/receipts',
    label: 'Receipt Management',
    icon: <Receipt className="h-5 w-5" />,
    roles: ['accountant', 'admin']
  },
  {
    path: '/xero-sync',
    label: 'Xero Integration',
    icon: <FileText className="h-5 w-5" />,
    roles: ['accountant', 'admin']
  },

  // Investor items
  {
    path: '/investor-portal',
    label: 'Investment Portal',
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ['investor', 'admin']
  },
  {
    path: '/heatmap',
    label: 'Project Analytics',
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ['investor', 'admin']
  }
];

const RoleBasedNavigation = ({ userRole, isCollapsed = false }: RoleBasedNavigationProps) => {
  const [location] = useLocation();

  // Filter navigation items based on user role
  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  if (allowedItems.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No navigation items available for your role.</p>
      </div>
    );
  }

  return (
    <nav className="space-y-2 p-4">
      {allowedItems.map((item) => {
        const isActive = location === item.path;
        
        return (
          <Link key={item.path} href={item.path}>
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-lush-primary text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default RoleBasedNavigation;