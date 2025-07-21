import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  User, 
  Shield, 
  Activity, 
  Settings,
  Eye,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  BarChart3
} from 'lucide-react';

interface UserDetailData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'builder' | 'client' | 'accountant' | 'investor';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  projectsCount: number;
  createdAt: string;
  phone?: string;
  address?: string;
  department?: string;
  reportsTo?: string;
  permissions: string[];
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
    details: string;
  }>;
  projectAccess: Array<{
    id: string;
    name: string;
    role: string;
    status: string;
  }>;
}

const UserDetailView = () => {
  const [match, params] = useRoute('/users/:userId');
  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const [impersonationMode, setImpersonationMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = params?.userId;

  useEffect(() => {
    // In real app, fetch user data from API
    // For now, use mock data based on userId
    const mockUserData: Record<string, UserDetailData> = {
      'user-001': {
        id: 'user-001',
        name: 'Sarah Chen',
        email: 'admin@lush.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2025-01-21T13:30:00Z',
        projectsCount: 15,
        createdAt: '2024-01-15T09:00:00Z',
        phone: '+1 (555) 123-4567',
        address: '123 Admin Street, Sydney NSW 2000',
        department: 'Administration',
        permissions: ['user_management', 'project_management', 'financial_oversight', 'system_admin'],
        recentActivity: [
          { id: '1', action: 'Viewed user profile', timestamp: '2025-01-21T13:25:00Z', details: 'Viewed Mike Johnson profile' },
          { id: '2', action: 'Updated project status', timestamp: '2025-01-21T12:45:00Z', details: 'Changed Project Alpha status to Active' },
          { id: '3', action: 'Generated report', timestamp: '2025-01-21T11:30:00Z', details: 'Monthly financial summary report' }
        ],
        projectAccess: [
          { id: 'proj-1', name: 'Luxury Apartments - Bondi', role: 'Project Manager', status: 'Active' },
          { id: 'proj-2', name: 'Commercial Complex - CBD', role: 'Supervisor', status: 'Planning' },
          { id: 'proj-3', name: 'Residential Towers - Parramatta', role: 'Oversight', status: 'Construction' }
        ]
      },
      'user-002': {
        id: 'user-002',
        name: 'Mike Johnson',
        email: 'builder@lush.com',
        role: 'builder',
        status: 'active',
        lastLogin: '2025-01-21T12:45:00Z',
        projectsCount: 8,
        createdAt: '2024-02-20T10:30:00Z',
        phone: '+1 (555) 234-5678',
        address: '456 Builder Avenue, Melbourne VIC 3000',
        department: 'Construction',
        reportsTo: 'Sarah Chen',
        permissions: ['project_updates', 'upload_progress', 'view_schedules'],
        recentActivity: [
          { id: '1', action: 'Uploaded progress photos', timestamp: '2025-01-21T12:40:00Z', details: '15 new construction photos for Project Beta' },
          { id: '2', action: 'Updated milestone', timestamp: '2025-01-21T11:20:00Z', details: 'Marked foundation complete' },
          { id: '3', action: 'Submitted expense report', timestamp: '2025-01-21T10:15:00Z', details: 'Materials cost $15,240' }
        ],
        projectAccess: [
          { id: 'proj-4', name: 'Single Family Home - Brighton', role: 'Lead Builder', status: 'Construction' },
          { id: 'proj-5', name: 'Duplex Development - Richmond', role: 'Site Manager', status: 'Active' }
        ]
      }
    };

    // Simulate API delay
    setTimeout(() => {
      if (userId && mockUserData[userId]) {
        setUserData(mockUserData[userId]);
        
        // Log admin access for compliance
        const auditEntry = {
          id: `audit-${Date.now()}`,
          adminUser: 'admin@lush.com',
          action: 'VIEW_USER_DETAILS',
          targetUser: mockUserData[userId].email,
          timestamp: new Date().toISOString(),
          ipAddress: 'client-ip',
          userAgent: navigator.userAgent
        };
        
        const existingAudits = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
        existingAudits.push(auditEntry);
        localStorage.setItem('admin_audit_log', JSON.stringify(existingAudits));
      }
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleImpersonateUser = () => {
    if (!userData) return;
    
    // Store current admin session
    const adminSession = localStorage.getItem('lush_user');
    localStorage.setItem('admin_session_backup', adminSession || '');
    
    // Set impersonation flags
    localStorage.setItem('impersonation_active', 'true');
    localStorage.setItem('impersonated_user', userData.email);
    
    // Create impersonated session
    const impersonatedSession = {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      loginTime: new Date().toISOString(),
      sessionId: `impersonate_${Date.now()}`,
      isImpersonation: true
    };
    
    localStorage.setItem('lush_user', JSON.stringify(impersonatedSession));
    
    // Log impersonation
    console.log('[ADMIN-AUDIT] User impersonation started:', {
      adminUser: 'admin@lush.com',
      targetUser: userData.email,
      timestamp: new Date().toISOString()
    });
    
    setImpersonationMode(true);
    
    // Redirect to user's dashboard
    const dashboards = {
      admin: '/dashboard',
      builder: '/builder', 
      client: '/client',
      accountant: '/finance',
      investor: '/investor'
    };
    
    window.location.href = dashboards[userData.role] || '/dashboard';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lush-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">User not found</h3>
        <p className="text-gray-600 mb-4">The requested user could not be located.</p>
        <Link href="/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleImpersonateUser}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="h-4 w-4 mr-2" />
            Impersonate User
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </div>
      </div>

      {/* User Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{userData.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getRoleColor(userData.role)}>
                    {userData.role}
                  </Badge>
                  <Badge className={getStatusColor(userData.status)}>
                    {userData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Projects Access</p>
                <p className="text-2xl font-bold text-lush-primary">{userData.projectsCount}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-lush-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-lg font-semibold">{new Date(userData.lastLogin).toLocaleDateString()}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{userData.email}</span>
                </div>
                {userData.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{userData.phone}</span>
                  </div>
                )}
                {userData.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{userData.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
                {userData.department && (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Department: {userData.department}</span>
                  </div>
                )}
                {userData.reportsTo && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Reports to: {userData.reportsTo}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                    <Activity className="h-5 w-5 text-lush-primary mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData.projectAccess.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-600">Role: {project.role}</p>
                    </div>
                    <Badge className={getStatusColor(project.status.toLowerCase())}>
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userData.permissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium capitalize">
                      {permission.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailView;