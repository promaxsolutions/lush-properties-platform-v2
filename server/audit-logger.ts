import { Request } from 'express';

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  impersonatedUser?: string;
  targetUser?: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sessionId?: string;
  additionalData?: any;
}

// In-memory audit log storage (in production, use database)
let auditLogs: AuditLogEntry[] = [];

export function logActivity(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>, req?: Request): void {
  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ip: req?.ip || req?.socket?.remoteAddress || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    ...entry
  };

  auditLogs.push(auditEntry);

  // Console logging for development
  console.log('[SECURITY-AUDIT]', {
    action: auditEntry.action,
    performedBy: auditEntry.performedBy,
    riskLevel: auditEntry.riskLevel,
    timestamp: auditEntry.timestamp,
    ip: auditEntry.ip
  });

  // In production, also send to external security monitoring
  if (auditEntry.riskLevel === 'HIGH' || auditEntry.riskLevel === 'CRITICAL') {
    console.warn('[HIGH-RISK-ACTIVITY]', auditEntry);
  }
}

export function getAuditLogs(filters?: {
  action?: string;
  performedBy?: string;
  riskLevel?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): AuditLogEntry[] {
  let filteredLogs = [...auditLogs];

  if (filters?.action) {
    filteredLogs = filteredLogs.filter(log => log.action === filters.action);
  }

  if (filters?.performedBy) {
    filteredLogs = filteredLogs.filter(log => 
      log.performedBy.toLowerCase().includes(filters.performedBy!.toLowerCase())
    );
  }

  if (filters?.riskLevel) {
    filteredLogs = filteredLogs.filter(log => log.riskLevel === filters.riskLevel);
  }

  if (filters?.startDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) >= new Date(filters.startDate!)
    );
  }

  if (filters?.endDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) <= new Date(filters.endDate!)
    );
  }

  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply limit
  if (filters?.limit) {
    filteredLogs = filteredLogs.slice(0, filters.limit);
  }

  return filteredLogs;
}

export function getAuditStats(): {
  totalLogs: number;
  highRiskCount: number;
  impersonationCount: number;
  recentActivity: number;
} {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return {
    totalLogs: auditLogs.length,
    highRiskCount: auditLogs.filter(log => 
      log.riskLevel === 'HIGH' || log.riskLevel === 'CRITICAL'
    ).length,
    impersonationCount: auditLogs.filter(log => 
      log.action.includes('IMPERSONATION')
    ).length,
    recentActivity: auditLogs.filter(log => 
      new Date(log.timestamp) >= last24Hours
    ).length
  };
}

// Initialize with some sample audit entries for demo
export function initializeSampleAuditData(): void {
  const sampleEntries = [
    {
      action: 'SUPERADMIN_IMPERSONATION',
      performedBy: 'superadmin@lush.com',
      impersonatedUser: 'builder@lush.com',
      riskLevel: 'HIGH' as const,
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      sessionId: 'superadmin_session_123'
    },
    {
      action: 'ADMIN_PORTAL_PREVIEW',
      performedBy: 'admin@lush.com',
      targetUser: 'client@lush.com',
      riskLevel: 'MEDIUM' as const,
      ip: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      sessionId: 'admin_session_456'
    },
    {
      action: 'USER_LOGIN',
      performedBy: 'accountant@lush.com',
      riskLevel: 'LOW' as const,
      ip: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      sessionId: 'user_session_789'
    }
  ];

  sampleEntries.forEach(entry => {
    logActivity(entry);
  });
}