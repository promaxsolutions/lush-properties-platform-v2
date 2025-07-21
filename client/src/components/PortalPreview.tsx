import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  User, 
  Shield, 
  Eye,
  ExternalLink,
  Monitor
} from 'lucide-react';

interface PortalPreviewProps {
  userId?: string;
  role?: string;
}

const PortalPreview = ({ userId, role }: PortalPreviewProps) => {
  const [match, params] = useRoute('/portal/:role/:userId');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const previewUserId = userId || params?.userId;
  const previewRole = role || params?.role;

  useEffect(() => {
    console.log('[PORTAL-PREVIEW] Loading preview:', {
      userId: previewUserId,
      role: previewRole,
      timestamp: new Date().toISOString()
    });

    // Mock user data - in real app, fetch from API
    setTimeout(() => {
      setUserData({
        id: previewUserId,
        name: 'Preview User',
        email: `${previewRole}@lush.com`,
        role: previewRole
      });
      setLoading(false);
    }, 500);
  }, [previewUserId, previewRole]);

  const getRolePortalUrl = (role: string) => {
    const portals = {
      admin: '/dashboard',
      builder: '/builder',
      client: '/client',
      accountant: '/finance',
      investor: '/investor'
    };
    return portals[role] || '/dashboard';
  };

  const handleViewPortal = () => {
    const portalUrl = getRolePortalUrl(previewRole);
    console.log('[PORTAL-PREVIEW] Navigating to portal:', {
      role: previewRole,
      userId: previewUserId,
      targetUrl: portalUrl,
      timestamp: new Date().toISOString()
    });
    
    // Set preview context without impersonation
    localStorage.setItem('portal_preview_mode', 'true');
    localStorage.setItem('preview_role', previewRole);
    localStorage.setItem('preview_user_id', previewUserId);
    
    // Navigate to the actual portal
    window.location.href = portalUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lush-primary"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Portal Preview</h1>
            <p className="text-gray-600">Previewing {previewRole} portal for user {previewUserId}</p>
          </div>
        </div>
        <Button onClick={handleViewPortal} className="bg-lush-primary hover:bg-lush-dark">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Portal
        </Button>
      </div>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>{previewRole?.charAt(0).toUpperCase() + previewRole?.slice(1)} Portal Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{userData?.name}</h3>
                <p className="text-gray-600">{userData?.email}</p>
                <Badge className="mt-1">
                  {previewRole}
                </Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Portal Features:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {previewRole === 'admin' && (
                  <>
                    <li>• Full system administration</li>
                    <li>• User management and permissions</li>
                    <li>• Financial oversight and reporting</li>
                    <li>• Project management and approval</li>
                  </>
                )}
                {previewRole === 'builder' && (
                  <>
                    <li>• Project progress tracking</li>
                    <li>• Photo and document uploads</li>
                    <li>• Milestone and timeline management</li>
                    <li>• Expense and material tracking</li>
                  </>
                )}
                {previewRole === 'client' && (
                  <>
                    <li>• Project progress monitoring</li>
                    <li>• Upgrade requests and approvals</li>
                    <li>• Document and contract access</li>
                    <li>• Communication with team</li>
                  </>
                )}
                {previewRole === 'accountant' && (
                  <>
                    <li>• Financial data and receipts</li>
                    <li>• Payment claims processing</li>
                    <li>• Expense categorization</li>
                    <li>• Audit trail and compliance</li>
                  </>
                )}
                {previewRole === 'investor' && (
                  <>
                    <li>• Investment portfolio tracking</li>
                    <li>• ROI and performance analytics</li>
                    <li>• Project funding opportunities</li>
                    <li>• Financial projections and reports</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleViewPortal} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Portal
              </Button>
              <Link href={`/users/${previewUserId}`}>
                <Button variant="outline" className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  User Details
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalPreview;