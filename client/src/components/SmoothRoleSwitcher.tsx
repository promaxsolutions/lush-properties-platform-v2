import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Crown, 
  Hammer, 
  Users, 
  Calculator, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  LogOut,
  RefreshCw
} from 'lucide-react';

const SmoothRoleSwitcher = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("lush_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const switchToRole = async (email: string, role: string, name: string, dashboardPath: string) => {
    setIsTransitioning(true);
    
    // Clear all existing data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cached auth data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Set new user data
    const newUser = {
      email,
      role,
      name,
      id: `${role}_${Date.now()}`,
      loginTime: new Date().toISOString(),
      sessionId: `session_${Math.random().toString(36).substr(2, 9)}`
    };
    
    localStorage.setItem("lush_user", JSON.stringify(newUser));
    
    // Trigger auth update events with delay to ensure localStorage is written
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('userLogin'));
      window.dispatchEvent(new CustomEvent('storage'));
      window.dispatchEvent(new CustomEvent('authChange'));
    }, 100);
    
    // Force page reload and redirect
    setTimeout(() => {
      window.location.href = dashboardPath;
    }, 300);
  };

  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      email: 'admin@lush.com',
      userName: 'Sarah Johnson',
      dashboard: '/dashboard',
      icon: <Crown className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-800',
      description: 'Full system access'
    },
    {
      id: 'builder',
      name: 'Builder',
      email: 'builder@lush.com',
      userName: 'Mike Johnson',
      dashboard: '/builder',
      icon: <Hammer className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800',
      description: 'Construction management'
    },
    {
      id: 'client',
      name: 'Client',
      email: 'client@lush.com',
      userName: 'Jennifer Williams',
      dashboard: '/client',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800',
      description: 'Project tracking'
    },
    {
      id: 'accountant',
      name: 'Accountant',
      email: 'accountant@lush.com',
      userName: 'Emma Thompson',
      dashboard: '/finance',
      icon: <Calculator className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-800',
      description: 'Financial management'
    },
    {
      id: 'investor',
      name: 'Investor',
      email: 'investor@lush.com',
      userName: 'David Chen',
      dashboard: '/investor',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'bg-indigo-100 text-indigo-800',
      description: 'Portfolio oversight'
    }
  ];

  const currentUser = getCurrentUser();
  const currentRole = roles.find(role => role.id === currentUser?.role);

  const clearAllSessions = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 shadow-lg border-2 border-lush-primary/20">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-lush-primary" />
            Role Switcher
          </div>
          <div className="flex items-center gap-2">
            {currentRole && (
              <Badge className={currentRole.color}>
                {currentRole.icon}
                <span className="ml-1">{currentRole.name}</span>
              </Badge>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-3">
          {currentUser && (
            <div className="text-xs bg-gray-50 p-3 rounded border">
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-gray-600">{currentUser.email}</div>
              <div className="text-gray-500">Current Role: {currentUser.role}</div>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Switch to Role:</h4>
            {roles.map((role) => (
              <Button
                key={role.id}
                onClick={() => switchToRole(role.email, role.id, role.userName, role.dashboard)}
                disabled={isTransitioning || currentUser?.role === role.id}
                className={`w-full justify-start text-xs h-8 ${
                  currentUser?.role === role.id 
                    ? 'bg-lush-primary/10 border-lush-primary text-lush-primary' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                variant="outline"
              >
                {role.icon}
                <div className="ml-2 text-left flex-1">
                  <div className="font-medium">{role.name}</div>
                  <div className="text-gray-500 text-xs">{role.description}</div>
                </div>
                {currentUser?.role === role.id && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Active
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          
          <div className="pt-2 border-t space-y-2">
            <Button
              onClick={clearAllSessions}
              variant="outline"
              className="w-full text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-3 w-3 mr-2" />
              Clear All & Logout
            </Button>
          </div>
          
          {isTransitioning && (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Switching roles...
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 text-center">
            For testing purposes only
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SmoothRoleSwitcher;