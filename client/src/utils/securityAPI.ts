// 🔐 Security API utilities for comprehensive security management

export interface SecurityUser {
  id: string;
  email: string;
  role: 'admin' | 'builder' | 'client' | 'investor' | 'lender';
  token: string;
  permissions: string[];
  lastActivity: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  email: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

export interface SecureUploadResult {
  success: boolean;
  fileId: string;
  hash: string;
  uploadedBy: string;
  timestamp: string;
  fraud_score?: number;
  fraud_flags?: string[];
}

export interface ESignatureRequest {
  id: string;
  documentId: string;
  recipientEmail: string;
  otpCode: string;
  expiresAt: string;
  status: 'sent' | 'pending' | 'signed' | 'expired';
}

// Role-based authentication
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });

    const result = await response.json();
    return result.valid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

export const checkPermissions = async (userId: string, action: string, resource: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action, resource })
    });

    const result = await response.json();
    return result.hasPermission;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};

// Audit logging
export const logActivity = async (
  userId: string,
  email: string,
  action: string,
  resource: string = '',
  details: any = {}
): Promise<boolean> => {
  try {
    const response = await fetch('/api/audit/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        email,
        action,
        resource,
        details,
        timestamp: new Date().toISOString(),
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Activity logging failed:', error);
    return false;
  }
};

export const getAuditLogs = async (userId?: string, limit: number = 100): Promise<AuditLogEntry[]> => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    params.append('limit', limit.toString());

    const response = await fetch(`/api/audit/logs?${params}`);
    const result = await response.json();
    return result.success ? result.logs : [];
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
};

// Secure file upload with hashing and fraud detection
export const uploadSecurePhoto = async (
  projectId: string,
  userEmail: string,
  file: File
): Promise<SecureUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('userEmail', userEmail);
    formData.append('timestamp', new Date().toISOString());

    const response = await fetch('/api/upload/secure', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      // Log the upload activity
      await logActivity(
        result.uploadedBy,
        userEmail,
        'SECURE_UPLOAD',
        `Project: ${projectId}`,
        {
          filename: file.name,
          fileSize: file.size,
          hash: result.hash,
          fraudScore: result.fraud_score
        }
      );
    }

    return result;
  } catch (error) {
    console.error('Secure upload failed:', error);
    return {
      success: false,
      fileId: '',
      hash: '',
      uploadedBy: '',
      timestamp: ''
    };
  }
};

// E-signature with OTP verification
export const triggerESignature = async (
  documentId: string,
  recipientEmail: string,
  documentType: string = 'progress_claim'
): Promise<{ success: boolean; requestId?: string; expiresAt?: string }> => {
  try {
    const response = await fetch('/api/esignature/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId,
        recipientEmail,
        documentType,
        expiresIn: 24 * 60 * 60 * 1000 // 24 hours
      })
    });

    const result = await response.json();
    
    if (result.success) {
      await logActivity(
        'system',
        recipientEmail,
        'ESIGNATURE_REQUEST',
        documentId,
        {
          documentType,
          expiresAt: result.expiresAt,
          requestId: result.requestId
        }
      );
    }

    return result;
  } catch (error) {
    console.error('E-signature request failed:', error);
    return { success: false };
  }
};

export const verifyESignatureOTP = async (
  requestId: string,
  otpCode: string,
  userEmail: string
): Promise<{ success: boolean; signatureId?: string }> => {
  try {
    const response = await fetch('/api/esignature/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        otpCode,
        userEmail,
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();
    
    if (result.success) {
      await logActivity(
        result.userId || 'unknown',
        userEmail,
        'ESIGNATURE_COMPLETED',
        requestId,
        {
          signatureId: result.signatureId,
          signedAt: new Date().toISOString()
        }
      );
    }

    return result;
  } catch (error) {
    console.error('OTP verification failed:', error);
    return { success: false };
  }
};

// Fraud detection for receipts
export const scanReceiptForFraud = async (file: File): Promise<{
  fraudScore: number;
  flags: string[];
  confidence: number;
  details: any;
}> => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await fetch('/api/fraud/scan-receipt', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result.success ? result : {
      fraudScore: 0,
      flags: [],
      confidence: 0,
      details: {}
    };
  } catch (error) {
    console.error('Fraud scanning failed:', error);
    return {
      fraudScore: 0,
      flags: ['scan_error'],
      confidence: 0,
      details: { error: error.message }
    };
  }
};

// Invite link security
export const createSecureInvite = async (
  email: string,
  role: string,
  projectId?: string
): Promise<{ success: boolean; inviteId?: string; expiresAt?: string }> => {
  try {
    const response = await fetch('/api/invites/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        role,
        projectId,
        expiresIn: 24 * 60 * 60 * 1000 // 24 hours
      })
    });

    const result = await response.json();
    
    if (result.success) {
      await logActivity(
        'system',
        'admin@system.com',
        'INVITE_CREATED',
        email,
        {
          role,
          projectId,
          inviteId: result.inviteId,
          expiresAt: result.expiresAt
        }
      );
    }

    return result;
  } catch (error) {
    console.error('Invite creation failed:', error);
    return { success: false };
  }
};

export const validateInvite = async (inviteId: string): Promise<{
  valid: boolean;
  email?: string;
  role?: string;
  expired?: boolean;
}> => {
  try {
    const response = await fetch(`/api/invites/validate/${inviteId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Invite validation failed:', error);
    return { valid: false };
  }
};

// Helper functions
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('/api/client-ip');
    const result = await response.json();
    return result.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};

export const generateSecureHash = (data: string): string => {
  // In production, use proper crypto library
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};