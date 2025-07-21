import { Request, Response, NextFunction } from 'express';
import { logActivity } from '../audit-logger';

// Extended request interface to include user information
interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    role: string;
    id: string;
  };
}

export const auditImpersonation = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if this is an impersonation-related request
  const isImpersonationRoute = req.path.includes('/impersonate') || 
                               req.path.includes('/portal') ||
                               req.headers['x-impersonation-active'] === 'true';

  if (isImpersonationRoute && req.user) {
    const impersonatedUser = req.headers['x-impersonated-user'] as string;
    const impersonationType = req.headers['x-impersonation-type'] as string || 'unknown';

    // Log the impersonation activity
    logActivity({
      action: req.user.role === 'superadmin' ? 'SUPERADMIN_IMPERSONATION' : 'ADMIN_PORTAL_PREVIEW',
      performedBy: req.user.email,
      impersonatedUser: impersonatedUser,
      riskLevel: req.user.role === 'superadmin' ? 'HIGH' : 'MEDIUM',
      sessionId: req.session?.id || 'unknown',
      additionalData: {
        impersonationType,
        targetRoute: req.path,
        method: req.method
      }
    }, req);

    console.log('[IMPERSONATION-AUDIT]', {
      admin: req.user.email,
      role: req.user.role,
      target: impersonatedUser,
      route: req.path,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

export const auditUserLogin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check for login-related activities
  if (req.path.includes('/login') || req.path.includes('/auth')) {
    const userEmail = req.body?.email || req.user?.email;
    
    if (userEmail) {
      logActivity({
        action: 'USER_LOGIN_ATTEMPT',
        performedBy: userEmail,
        riskLevel: 'LOW',
        additionalData: {
          loginMethod: req.body?.method || 'standard',
          userAgent: req.get('User-Agent')
        }
      }, req);
    }
  }

  next();
};

export const auditHighRiskActions = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const highRiskRoutes = [
    '/api/admin',
    '/api/users/delete',
    '/api/security',
    '/api/audit'
  ];

  const isHighRisk = highRiskRoutes.some(route => req.path.startsWith(route));

  if (isHighRisk && req.user) {
    logActivity({
      action: 'HIGH_RISK_API_ACCESS',
      performedBy: req.user.email,
      riskLevel: 'HIGH',
      additionalData: {
        endpoint: req.path,
        method: req.method,
        body: req.method !== 'GET' ? 'data_submitted' : undefined
      }
    }, req);
  }

  next();
};

// Comprehensive audit middleware that combines all audit functions
export const comprehensiveAudit = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Run all audit checks
  auditImpersonation(req, res, () => {
    auditUserLogin(req, res, () => {
      auditHighRiskActions(req, res, next);
    });
  });
};