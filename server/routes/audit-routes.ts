import express from 'express';
import { logActivity, getAuditLogs, getAuditStats } from '../audit-logger';

const router = express.Router();

// Middleware to check admin permissions
const requireAdmin = (req: any, res: any, next: any) => {
  // In a real app, verify JWT token and check role
  const userRole = req.headers['x-user-role'] || 'guest';
  
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return res.status(403).json({ error: 'Access denied: Admin role required' });
  }
  
  next();
};

// Get audit logs with filtering
router.get('/logs', requireAdmin, (req, res) => {
  try {
    const filters = {
      action: req.query.action as string,
      performedBy: req.query.performedBy as string,
      riskLevel: req.query.riskLevel as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50
    };

    const logs = getAuditLogs(filters);
    
    res.json({
      success: true,
      logs,
      totalCount: logs.length
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get audit statistics
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const stats = getAuditStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching audit stats:', error);
    res.status(500).json({ error: 'Failed to fetch audit statistics' });
  }
});

// Log new audit entry (for client-side actions)
router.post('/log', requireAdmin, (req, res) => {
  try {
    const { action, performedBy, targetUser, riskLevel, additionalData } = req.body;

    if (!action || !performedBy || !riskLevel) {
      return res.status(400).json({ 
        error: 'Missing required fields: action, performedBy, riskLevel' 
      });
    }

    logActivity({
      action,
      performedBy,
      targetUser,
      riskLevel,
      additionalData
    }, req);

    res.json({
      success: true,
      message: 'Audit entry logged successfully'
    });
  } catch (error) {
    console.error('Error logging audit entry:', error);
    res.status(500).json({ error: 'Failed to log audit entry' });
  }
});

// Get impersonation logs specifically
router.get('/impersonations', requireAdmin, (req, res) => {
  try {
    const impersonationLogs = getAuditLogs({
      action: 'SUPERADMIN_IMPERSONATION',
      limit: req.query.limit ? parseInt(req.query.limit as string) : 25
    });

    res.json({
      success: true,
      logs: impersonationLogs,
      totalCount: impersonationLogs.length
    });
  } catch (error) {
    console.error('Error fetching impersonation logs:', error);
    res.status(500).json({ error: 'Failed to fetch impersonation logs' });
  }
});

export default router;