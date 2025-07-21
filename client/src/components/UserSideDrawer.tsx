import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  User, 
  Eye, 
  Shield, 
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Activity
} from 'lucide-react';
import { Link } from 'wouter';

interface UserSideDrawerProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onImpersonate: (user: any) => void;
}

const UserSideDrawer = ({ user, isOpen, onClose, onImpersonate }: UserSideDrawerProps) => {
  if (!isOpen || !user) return null;

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      builder: 'bg-blue-100 text-blue-800',
      client: 'bg-green-100 text-green-800',
      accountant: 'bg-purple-100 text-purple-800',
      investor: 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Side Drawer */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">User Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* User Info Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span>Projects: {user.projectsCount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-lush-primary">{user.projectsCount}</div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{user.status === 'active' ? '✓' : '✗'}</div>
                    <div className="text-xs text-gray-600">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Logged in {new Date(user.lastLogin).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Updated project status</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Uploaded documents</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="border-t p-4 space-y-2">
            <Link href={`/users/${user.id}`}>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  console.log('[USER-DRAWER] View full details clicked:', {
                    userId: user.id,
                    userName: user.name,
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </Button>
            </Link>
            
            <Link href={`/portal/${user.role}/${user.id}`}>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  console.log('[USER-DRAWER] Preview portal clicked:', {
                    userId: user.id,
                    userRole: user.role,
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Portal
              </Button>
            </Link>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => {
                console.log('[USER-DRAWER] Impersonate clicked:', {
                  userId: user.id,
                  userName: user.name,
                  userRole: user.role,
                  timestamp: new Date().toISOString()
                });
                onImpersonate(user);
                onClose();
              }}
            >
              <Shield className="h-4 w-4 mr-2" />
              Impersonate User
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSideDrawer;