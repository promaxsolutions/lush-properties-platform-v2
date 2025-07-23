import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  userRole?: string;
  role?: string;
  isCollapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}

const getNavigationItems = (userRole: string): NavigationItem[] => {
  // Admin gets full navigation access to all portals
  if (userRole === 'admin' || userRole === 'superadmin') {
    return [
      {
        path: '/dashboard',
        label: 'Admin Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/builder',
        label: 'Builder Portal',
        icon: <Building className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/client',
        label: 'Client Portal',
        icon: <Home className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/finance',
        label: 'Finance Portal',
        icon: <DollarSign className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/investor',
        label: 'Investor Portal',
        icon: <TrendingUp className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/users',
        label: 'Team Manager',
        icon: <Users className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/audit',
        label: 'Security',
        icon: <Settings className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/contracts',
        label: 'Contracts',
        icon: <FileText className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/profits',
        label: 'Profit Calculator',
        icon: <Receipt className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      },
      {
        path: '/ai-workflows',
        label: 'AI Workflows',
        icon: <MessageCircle className="h-5 w-5" />,
        roles: ['admin', 'superadmin']
      }
    ];
  }

  // Builder navigation - focused on construction tasks
  if (userRole === 'builder') {
    return [
      {
        path: '/builder',
        label: 'My Dashboard',
        icon: <Home className="h-5 w-5" />,
        roles: ['builder']
      },
      {
        path: '/uploads',
        label: 'Upload Progress',
        icon: <Upload className="h-5 w-5" />,
        roles: ['builder']
      },
      {
        path: '/timeline',
        label: 'Project Timeline',
        icon: <Calendar className="h-5 w-5" />,
        roles: ['builder']
      }
    ];
  }

  // Client navigation - project tracking focused
  if (userRole === 'client') {
    return [
      {
        path: '/client',
        label: 'My Project',
        icon: <Home className="h-5 w-5" />,
        roles: ['client']
      },
      {
        path: '/uploads',
        label: 'Project Progress',
        icon: <Upload className="h-5 w-5" />,
        roles: ['client']
      },
      {
        path: '/documents',
        label: 'My Documents',
        icon: <FileText className="h-5 w-5" />,
        roles: ['client']
      }
    ];
  }

  // Accountant navigation - financial management
  if (userRole === 'accountant') {
    return [
      {
        path: '/finance',
        label: 'Finance Dashboard',
        icon: <Home className="h-5 w-5" />,
        roles: ['accountant']
      },
      {
        path: '/receipts',
        label: 'Receipt Management',
        icon: <Receipt className="h-5 w-5" />,
        roles: ['accountant']
      },
      {
        path: '/claims',
        label: 'Payment Claims',
        icon: <DollarSign className="h-5 w-5" />,
        roles: ['accountant']
      }
    ];
  }

  // Investor navigation - investment tracking
  if (userRole === 'investor') {
    return [
      {
        path: '/investor',
        label: 'My Investments',
        icon: <Home className="h-5 w-5" />,
        roles: ['investor']
      },
      {
        path: '/documents',
        label: 'Investment Docs',
        icon: <FileText className="h-5 w-5" />,
        roles: ['investor']
      }
    ];
  }

  return [];
};

const RoleBasedNavigation = ({ 
  userRole, 
  role, 
  isCollapsed = false, 
  mobile = false, 
  onNavigate 
}: RoleBasedNavigationProps) => {
  const location = useLocation();
  const currentRole = userRole || role || 'client';

  // Get navigation items based on user role with proper filtering
  const navigationItems = getNavigationItems(currentRole);
  const allowedItems = navigationItems.filter(item => item.roles.includes(currentRole));
  
  console.log('[NAV] Rendering navigation for role:', userRole, 'Items:', allowedItems.length, 'Current location:', location);

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
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${
              mobile ? 'min-h-[48px] text-base' : 'text-sm'
            } ${
              isActive
                ? 'bg-[#007144] text-white shadow-sm'
                : mobile 
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            data-nav-item={item.path}
            data-nav-role={userRole}
            data-nav-active={isActive}
            onClick={(e) => {
              console.log(`[NAV-CLICK] Navigation triggered:`, {
                path: item.path,
                label: item.label,
                userRole: currentRole,
                timestamp: new Date().toISOString(),
                isHashLink: item.path.includes('#')
              });
              
              // Call mobile onNavigate if provided
              if (mobile && onNavigate) {
                onNavigate();
              }
              
              // Check if this is a hash link
              if (item.path.includes('#')) {
                e.preventDefault();
                const [path, hash] = item.path.split('#');
                if (hash && window.scrollToSection) {
                  window.scrollToSection(hash);
                  return;
                }
              }
              
              // Smooth scroll for internal navigation
              setTimeout(() => {
                const targetElement = document.querySelector('main') || 
                                   document.querySelector('.main-content') || 
                                   document.body;
                targetElement.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }, 50);
              
              // Add mobile haptic feedback if available
              if ('vibrate' in navigator) {
                navigator.vibrate(50);
              }
              
              console.log(`[NAV-CLICK] Completed navigation to ${item.path} with smooth scroll`);
            }}
          >
            <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default RoleBasedNavigation;