import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, X, User } from 'lucide-react';

const ImpersonationBanner = () => {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState('');

  useEffect(() => {
    // Check if currently impersonating
    const impersonationActive = localStorage.getItem('impersonation_active') === 'true';
    const impersonatedUserEmail = localStorage.getItem('impersonated_user') || '';
    
    setIsImpersonating(impersonationActive);
    setImpersonatedUser(impersonatedUserEmail);
  }, []);

  const handleExitImpersonation = () => {
    // Restore admin session
    const adminSessionBackup = localStorage.getItem('admin_session_backup');
    
    if (adminSessionBackup) {
      localStorage.setItem('lush_user', adminSessionBackup);
    }
    
    // Clear impersonation flags
    localStorage.removeItem('impersonation_active');
    localStorage.removeItem('impersonated_user');
    localStorage.removeItem('admin_session_backup');
    
    // Log exit impersonation
    console.log('[ADMIN-AUDIT] Impersonation ended:', {
      adminUser: 'admin@lush.com',
      previouslyImpersonated: impersonatedUser,
      timestamp: new Date().toISOString(),
      action: 'EXIT_IMPERSONATION'
    });
    
    // Audit log entry
    const auditEntry = {
      id: `audit-${Date.now()}`,
      adminUser: 'admin@lush.com',
      action: 'EXIT_IMPERSONATION',
      targetUser: impersonatedUser,
      timestamp: new Date().toISOString(),
      ipAddress: 'client-ip',
      userAgent: navigator.userAgent
    };
    
    const existingAudits = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
    existingAudits.push(auditEntry);
    localStorage.setItem('admin_audit_log', JSON.stringify(existingAudits));
    
    // Trigger auth update
    window.dispatchEvent(new CustomEvent('authUpdate'));
    
    // Redirect to admin dashboard
    window.location.href = '/dashboard';
  };

  if (!isImpersonating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white p-2 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5" />
          <span className="font-medium">
            Admin Mode: Viewing as {impersonatedUser}
          </span>
          <div className="hidden md:flex items-center space-x-2 text-orange-100">
            <User className="h-4 w-4" />
            <span className="text-sm">
              You are impersonating this user's view. All actions are logged for compliance.
            </span>
          </div>
        </div>
        
        <Button
          onClick={handleExitImpersonation}
          variant="secondary"
          size="sm"
          className="bg-white text-orange-600 hover:bg-orange-50"
        >
          <X className="h-4 w-4 mr-1" />
          Exit Impersonation
        </Button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;