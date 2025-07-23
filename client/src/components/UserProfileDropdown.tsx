import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { performSecureLogout } from '@/utils/sessionManager';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import SecureLogout from './SecureLogout';
import {
  User,
  Settings,
  Bell,
  Shield,
  LogOut,
  Crown,
  ChevronDown
} from 'lucide-react';

const UserProfileDropdown = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = () => {
      const userStr = localStorage.getItem("lush_user");
      if (!userStr) return null;
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    };

    const handleUserChange = () => {
      setUser(getCurrentUser());
    };

    setUser(getCurrentUser());
    
    const handleLogoutTrigger = () => {
      performSecureLogout();
    };

    window.addEventListener('userLogin', handleUserChange);
    window.addEventListener('roleChange', handleUserChange);
    window.addEventListener('logout', handleUserChange);
    window.addEventListener('storage', handleUserChange);
    window.addEventListener('triggerLogout', handleLogoutTrigger);
    
    return () => {
      window.removeEventListener('userLogin', handleUserChange);
      window.removeEventListener('roleChange', handleUserChange);
      window.removeEventListener('logout', handleUserChange);
      window.removeEventListener('storage', handleUserChange);
      window.removeEventListener('triggerLogout', handleLogoutTrigger);
    };
  }, []);

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'builder':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'client':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'investor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'accountant':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return <Crown className="w-3 h-3" />;
      case 'builder':
        return <Settings className="w-3 h-3" />;
      case 'client':
        return <User className="w-3 h-3" />;
      case 'investor':
        return <Shield className="w-3 h-3" />;
      case 'accountant':
        return <Bell className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getInitials = (email: string) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-12 px-3 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImage} alt={user.email} />
              <AvatarFallback className="bg-[#007144] text-white text-sm font-semibold">
                {getInitials(user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {user.name || user.email?.split('@')[0] || 'User'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {getRoleIcon(user.role)}
                <span className="text-xs text-gray-500 capitalize">{user.role}</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profileImage} alt={user.email} />
                <AvatarFallback className="bg-[#007144] text-white font-semibold">
                  {getInitials(user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`w-fit text-xs border ${getRoleColor(user.role)}`}
            >
              <div className="flex items-center gap-1.5">
                {getRoleIcon(user.role)}
                <span className="capitalize font-medium">{user.role}</span>
                {user.role === 'superadmin' && <Crown className="w-3 h-3 ml-1" />}
              </div>
            </Badge>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        
        {(user.role === 'admin' || user.role === 'superadmin') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer focus:bg-red-50 focus:text-red-600">
          <div className="flex items-center w-full" onClick={(e) => {
            e.preventDefault();
            // Trigger secure logout
            const event = new CustomEvent('triggerLogout');
            window.dispatchEvent(event);
          }}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;