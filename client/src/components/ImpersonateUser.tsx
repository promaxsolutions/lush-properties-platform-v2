import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  User, 
  Shield, 
  AlertTriangle,
  Eye,
  Clock,
  Activity
} from 'lucide-react';

const ImpersonateUser = () => {
  const [match, params] = useRoute('/impersonate/:userId');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const userId = params?.userId;

  useEffect(() => {
    // Check current user permissions
    const user = JSON.parse(localStorage.getItem('lush_user') || '{}');
    setCurrentUser(user);

    // Security check - only superadmin can access impersonation
    if (user.role !== 'superadmin') {
      console.error('[SECURITY] Unauthorized impersonation attempt:', {
        currentUser: user.email,
        currentRole: user.role,
        targetUserId: userId,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Load target user data
    const mockUserData = {
      'user-001': { id: 'user-001', name: 'Sarah Chen', email: 'admin@lush.com', role: 'admin' },
      'user-002': { id: 'user-002', name: 'Mike Johnson', email: 'builder@lush.com', role: 'builder' },
      'user-003': { id: 'user-003', name: 'Jennifer Williams', email: 'client@lush.com', role: 'client' },
      'user-004': { id: 'user-004', name: 'Emma Davis', email: 'accountant@lush.com', role: 'accountant' },
      'user-005': { id: 'user-005', name: 'Robert Kim', email: 'investor@lush.com', role: 'investor' }
    };

    setTimeout(() => {
      if (userId && mockUserData[userId]) {
        setUserData(mockUserData[userId]);
      }
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleImpersonate = () => {
    if (!userData || currentUser?.role !== 'superadmin') {
      console.error('[SECURITY] Impersonation blocked - insufficient permissions');
      return;
    }

    // Store current superadmin session
    const adminSession = localStorage.getItem('lush_user');
    localStorage.setItem('superadmin_session_backup', adminSession || '');
    
    // Set impersonation flags
    localStorage.setItem('impersonation_active', 'true');
    localStorage.setItem('impersonated_user', userData.email);
    localStorage.setItem('impersonating_superadmin', currentUser.email);
    
    // Create impersonated session
    const impersonatedSession = {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      loginTime: new Date().toISOString(),
      sessionId: `superadmin_impersonate_${Date.now()}`,
      isImpersonation: true,
      impersonatedBy: currentUser.email
    };
    
    localStorage.setItem('lush_user', JSON.stringify(impersonatedSession));
    
    // Security audit log
    console.log('[SECURITY-AUDIT] Superadmin impersonation initiated:', {
      superadmin: currentUser.email,
      targetUser: userData.email,
      targetRole: userData.role,
      timestamp: new Date().toISOString(),
      sessionId: impersonatedSession.sessionId
    });
    
    const auditEntry = {
      id: `security-audit-${Date.now()}`,
      action: 'SUPERADMIN_IMPERSONATION',
      superadmin: currentUser.email,
      targetUser: userData.email,
      targetRole: userData.role,
      timestamp: new Date().toISOString(),
      ipAddress: 'client-ip',
      userAgent: navigator.userAgent,
      riskLevel: 'HIGH'
    };
    
    const existingAudits = JSON.parse(localStorage.getItem('security_audit_log') || '[]');
    existingAudits.push(auditEntry);
    localStorage.setItem('security_audit_log', JSON.stringify(existingAudits));
    
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

  // Security check - redirect if not superadmin
  if (currentUser && currentUser.role !== 'superadmin') {
    return (
      <div className="p-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Access Denied: Only Super Administrators can access user impersonation.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/users">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Impersonate User</h1>
            <p className="text-gray-600">Super Admin Impersonation Interface</p>
          </div>
        </div>
      </div>

      {/* Security Warning */}
      <Alert className="border-orange-200 bg-orange-50">
        <Shield className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Security Notice:</strong> You are about to impersonate another user. All actions will be logged and audited. 
          This feature is restricted to Super Administrators only.
        </AlertDescription>
      </Alert>

      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Target User Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{userData.name}</h3>
                  <p className="text-gray-600">{userData.email}</p>
                  <Badge className="mt-1">
                    {userData.role}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Impersonation will be logged with timestamp</span>
              </div>
              <div className="flex items-center space-x-3">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-sm">All actions will be audited</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Session can be restored at any time</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impersonation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Impersonation Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Clicking "Start Impersonation" will:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Save your current Super Admin session</li>
              <li>• Switch to the target user's perspective</li>
              <li>• Log the impersonation for security audit</li>
              <li>• Redirect to the user's default dashboard</li>
              <li>• Display an impersonation banner for easy exit</li>
            </ul>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleImpersonate}
                className="bg-red-600 hover:bg-red-700"
              >
                <Shield className="h-4 w-4 mr-2" />
                Start Impersonation
              </Button>
              
              <Link href={`/portal/${userData.role}/${userData.id}`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Portal Instead
                </Button>
              </Link>
              
              <Link href="/users">
                <Button variant="ghost">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpersonateUser;