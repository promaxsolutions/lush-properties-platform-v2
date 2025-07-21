import { Router } from 'express';

const router = Router();

// Simple authentication middleware for demo
const isAuthenticated = (req: any, res: any, next: any) => {
  // Mock authentication - in production this would verify JWT or session
  req.user = {
    claims: { sub: 'user123', email: 'accountant@lush.com' },
    role: 'accountant'
  };
  next();
};

// Middleware to check if user is accountant or admin
const requireAccountantAccess = (req: any, res: any, next: any) => {
  const userRole = req.user?.role;
  if (userRole !== 'accountant' && userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Accountant role required.' });
  }
  next();
};

// Log document access for audit trail
const logDocumentAccess = (req: any, docId: string, action: string) => {
  const userId = req.user?.claims?.sub;
  const userEmail = req.user?.claims?.email;
  const timestamp = new Date().toISOString();
  const ipAddress = req.ip || req.connection.remoteAddress;
  
  console.log(`[AUDIT] Document Access - User: ${userEmail} (${userId}), Document: ${docId}, Action: ${action}, IP: ${ipAddress}, Time: ${timestamp}`);
  
  // In production, this would be stored in audit log database
  // await db.auditLogs.insert({
  //   userId,
  //   userEmail,
  //   action: `document_${action}`,
  //   resourceType: 'document',
  //   resourceId: docId,
  //   ipAddress,
  //   userAgent: req.headers['user-agent'],
  //   timestamp: new Date()
  // });
};

// Get all accessible documents for accountant
router.get('/documents', isAuthenticated, requireAccountantAccess, async (req: any, res) => {
  try {
    logDocumentAccess(req, 'all', 'list');
    
    // Mock document data - in production this would come from database
    const documents = [
      {
        id: 'doc_001',
        name: 'Construction Loan Agreement - Scullin Heights.pdf',
        type: 'loan_contract',
        projectId: 'proj_001',
        projectName: 'Scullin Heights Development',
        uploadDate: new Date('2024-12-15'),
        fileSize: 2048576,
        uploadedBy: 'admin@lush.com',
        accessLevel: 'download',
        category: 'Contracts',
        description: 'Primary construction loan documentation',
        filePath: '/uploads/contracts/loan_scullin_heights.pdf'
      },
      {
        id: 'doc_002',
        name: 'Sales Contract - Unit 3A Forrest.pdf',
        type: 'sales_contract',
        projectId: 'proj_002',
        projectName: 'Forrest Premium Townhouses',
        uploadDate: new Date('2025-01-10'),
        fileSize: 1536000,
        uploadedBy: 'broker@lush.com',
        accessLevel: 'download',
        category: 'Sales',
        description: 'Executed sales contract for Unit 3A',
        filePath: '/uploads/contracts/sales_forrest_3a.pdf'
      },
      {
        id: 'doc_003',
        name: 'Progress Claim #3 - Foundation Complete.pdf',
        type: 'progress_claim',
        projectId: 'proj_001',
        projectName: 'Scullin Heights Development',
        uploadDate: new Date('2025-01-15'),
        fileSize: 945120,
        uploadedBy: 'builder@lush.com',
        accessLevel: 'view',
        category: 'Claims',
        description: 'Foundation milestone claim submission',
        filePath: '/uploads/claims/progress_claim_3_foundation.pdf'
      },
      {
        id: 'doc_004',
        name: 'Materials Receipt - Steel Framing.pdf',
        type: 'receipt',
        projectId: 'proj_001',
        projectName: 'Scullin Heights Development',
        uploadDate: new Date('2025-01-18'),
        fileSize: 256000,
        uploadedBy: 'builder@lush.com',
        accessLevel: 'download',
        category: 'Receipts',
        description: 'Steel framing materials purchase',
        filePath: '/uploads/receipts/materials_steel_framing.pdf'
      },
      {
        id: 'doc_005',
        name: 'Site Foreman Employment Contract.pdf',
        type: 'employment_contract',
        projectId: undefined,
        projectName: 'Company Wide',
        uploadDate: new Date('2025-01-05'),
        fileSize: 512000,
        uploadedBy: 'hr@lush.com',
        accessLevel: 'view',
        category: 'HR',
        description: 'Employment agreement for site foreman position',
        filePath: '/uploads/hr/employment_foreman.pdf'
      },
      {
        id: 'doc_006',
        name: 'Q1 2025 BAS Preparation Documents.zip',
        type: 'tax_document',
        projectId: undefined,
        projectName: 'Tax Compliance',
        uploadDate: new Date('2025-01-20'),
        fileSize: 4096000,
        uploadedBy: 'accountant@lush.com',
        accessLevel: 'download',
        category: 'Tax',
        description: 'GST, BAS, and quarterly tax documentation',
        filePath: '/uploads/tax/q1_2025_bas_docs.zip'
      }
    ];

    res.json({
      success: true,
      documents,
      totalCount: documents.length,
      accessLevel: 'accountant_read_only'
    });
  } catch (error) {
    console.error('Error fetching accountant documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

// Get specific document metadata
router.get('/documents/:id', isAuthenticated, requireAccountantAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    logDocumentAccess(req, id, 'view_metadata');
    
    // Mock document lookup - in production this would query database
    const document = {
      id,
      name: 'Example Document.pdf',
      type: 'loan_contract',
      accessLevel: 'download',
      fileSize: 1024000,
      uploadDate: new Date(),
      description: 'Document metadata'
    };

    res.json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Error fetching document metadata:', error);
    res.status(500).json({ message: 'Failed to fetch document metadata' });
  }
});

// Download document (if access level permits)
router.get('/documents/:id/download', isAuthenticated, requireAccountantAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    logDocumentAccess(req, id, 'download');
    
    // Mock download - in production this would serve actual file
    res.json({
      success: true,
      message: 'Document download initiated',
      downloadUrl: `/api/files/download/${id}`,
      expiresIn: '1 hour'
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ message: 'Failed to download document' });
  }
});

// Get audit log for accountant document access
router.get('/audit-log', isAuthenticated, requireAccountantAccess, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    logDocumentAccess(req, 'audit_log', 'view');
    
    // Mock audit log - in production this would query audit database
    const auditEntries = [
      {
        id: 'audit_001',
        userId,
        userEmail: req.user?.claims?.email,
        action: 'document_view',
        resourceType: 'document',
        resourceId: 'doc_001',
        timestamp: new Date(),
        ipAddress: req.ip,
        success: true
      }
    ];

    res.json({
      success: true,
      auditEntries,
      totalCount: auditEntries.length
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ message: 'Failed to fetch audit log' });
  }
});

export default router;