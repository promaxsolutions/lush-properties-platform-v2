import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Eye, 
  UserCheck, 
  UserX, 
  Search, 
  Filter,
  MoreVertical,
  Shield,
  Activity
} from 'lucide-react';
import { Link } from 'wouter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserSideDrawer from './UserSideDrawer';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'builder' | 'client' | 'accountant' | 'investor';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  projectsCount: number;
  createdAt: string;
}

const AdminUserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mock user data - in real app, this would come from API
  const mockUsers: UserData[] = [
    {
      id: 'user-001',
      name: 'Sarah Chen',
      email: 'admin@lush.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-01-21T13:30:00Z',
      projectsCount: 15,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 'user-002',
      name: 'Mike Johnson',
      email: 'builder@lush.com',
      role: 'builder',
      status: 'active',
      lastLogin: '2025-01-21T12:45:00Z',
      projectsCount: 8,
      createdAt: '2024-02-20T10:30:00Z'
    },
    {
      id: 'user-003',
      name: 'Jennifer Williams',
      email: 'client@lush.com',
      role: 'client',
      status: 'active',
      lastLogin: '2025-01-21T11:20:00Z',
      projectsCount: 2,
      createdAt: '2024-03-10T14:15:00Z'
    },
    {
      id: 'user-004',
      name: 'Emma Davis',
      email: 'accountant@lush.com',
      role: 'accountant',
      status: 'active',
      lastLogin: '2025-01-21T09:15:00Z',
      projectsCount: 12,
      createdAt: '2024-01-25T11:45:00Z'
    },
    {
      id: 'user-005',
      name: 'Robert Kim',
      email: 'investor@lush.com',
      role: 'investor',
      status: 'active',
      lastLogin: '2025-01-20T16:30:00Z',
      projectsCount: 5,
      createdAt: '2024-04-05T13:20:00Z'
    }
  ];

  const handleViewUser = (user: UserData) => {
    // Log admin activity for compliance
    console.log('[ADMIN-AUDIT] User details viewed:', {
      adminUser: 'admin@lush.com',
      targetUser: user.email,
      timestamp: new Date().toISOString(),
      action: 'VIEW_USER_DETAILS'
    });
    
    // Store audit log entry
    const auditEntry = {
      id: `audit-${Date.now()}`,
      adminUser: 'admin@lush.com',
      action: 'VIEW_USER_DETAILS',
      targetUser: user.email,
      timestamp: new Date().toISOString(),
      ipAddress: 'client-ip',
      userAgent: navigator.userAgent
    };
    
    const existingAudits = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
    existingAudits.push(auditEntry);
    localStorage.setItem('admin_audit_log', JSON.stringify(existingAudits));
  };

  const handleImpersonateUser = (user: UserData) => {
    // Log impersonation activity
    console.log('[ADMIN-AUDIT] User impersonation initiated:', {
      adminUser: 'admin@lush.com',
      targetUser: user.email,
      timestamp: new Date().toISOString(),
      action: 'IMPERSONATE_USER'
    });

    // Store current admin session
    const adminSession = localStorage.getItem('lush_user');
    localStorage.setItem('admin_session_backup', adminSession || '');
    
    // Set impersonation flag
    localStorage.setItem('impersonation_active', 'true');
    localStorage.setItem('impersonated_user', user.email);
    
    // Switch to user's session
    const impersonatedSession = {
      email: user.email,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString(),
      sessionId: `impersonate_${Date.now()}`,
      isImpersonation: true
    };
    
    localStorage.setItem('lush_user', JSON.stringify(impersonatedSession));
    
    // Redirect to user's default dashboard
    const dashboards = {
      admin: '/dashboard',
      builder: '/builder',
      client: '/client',
      accountant: '/finance',
      investor: '/investor'
    };
    
    window.location.href = dashboards[user.role] || '/dashboard';
  };

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

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Manager</h1>
          <p className="text-gray-600">Manage users, roles, and access permissions</p>
        </div>
        <Button className="bg-lush-primary hover:bg-lush-dark">
          <User className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="builder">Builder</option>
                <option value="client">Client</option>
                <option value="accountant">Accountant</option>
                <option value="investor">Investor</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-600 mr-4">
                    <div>Projects: {user.projectsCount}</div>
                    <div>Last login: {new Date(user.lastLogin).toLocaleDateString()}</div>
                  </div>
                  
                  <Link href={`/users/${user.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        console.log('[ADMIN-NAV] View user clicked:', {
                          userId: user.id,
                          userName: user.name,
                          targetPath: `/users/${user.id}`,
                          timestamp: new Date().toISOString()
                        });
                        handleViewUser(user);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('[ADMIN-NAV] Quick preview clicked:', {
                        userId: user.id,
                        userName: user.name,
                        timestamp: new Date().toISOString()
                      });
                      setSelectedUser(user);
                      setDrawerOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Quick Preview
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* Check if current user is superadmin for impersonation */}
                      {JSON.parse(localStorage.getItem('lush_user') || '{}').role === 'superadmin' ? (
                        <Link href={`/impersonate/${user.id}`}>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log('[ADMIN-NAV] Impersonate user clicked:', {
                                userId: user.id,
                                userName: user.name,
                                userRole: user.role,
                                timestamp: new Date().toISOString()
                              });
                            }}
                            className="text-red-600"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Impersonate User
                          </DropdownMenuItem>
                        </Link>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            console.log('[ADMIN-NAV] Quick impersonate clicked:', {
                              userId: user.id,
                              userName: user.name,
                              userRole: user.role,
                              timestamp: new Date().toISOString()
                            });
                            handleImpersonateUser(user);
                          }}
                          className="text-blue-600"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Quick Switch
                        </DropdownMenuItem>
                      )}
                      <Link href={`/portal/${user.role}/${user.id}`}>
                        <DropdownMenuItem
                          onClick={() => {
                            console.log('[ADMIN-NAV] Portal preview clicked:', {
                              userId: user.id,
                              userRole: user.role,
                              targetPath: `/portal/${user.role}/${user.id}`,
                              timestamp: new Date().toISOString()
                            });
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Portal
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Edit Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <UserX className="h-4 w-4 mr-2" />
                        Suspend User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </CardContent>
        </Card>
      )}

      {/* User Side Drawer */}
      <UserSideDrawer
        user={selectedUser}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
        }}
        onImpersonate={handleImpersonateUser}
      />
    </div>
  );
};

export default AdminUserList;