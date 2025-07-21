import { Request, Response } from 'express';

// Emergency role fixing endpoint
export const quickRoleFix = async (req: Request, res: Response) => {
  try {
    const { email, correctRole } = req.body;
    
    // In a real app, this would update the database
    // For now, we'll return success and let the frontend handle localStorage
    
    const roleFixData = {
      email: email?.toLowerCase(),
      role: correctRole,
      fixedAt: new Date().toISOString(),
      success: true
    };

    res.json({
      success: true,
      message: `Role fixed for ${email} to ${correctRole}`,
      data: roleFixData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fix role',
      error: error.message
    });
  }
};

// Get user's correct role from "database"
export const getCorrectRole = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    // Mock user role lookup (in real app, query database)
    const userRoles: { [key: string]: string } = {
      "admin@lush.com": "admin",
      "builder@lush.com": "builder", 
      "client@lush.com": "client",
      "investor@lush.com": "investor",
      "accountant@lush.com": "accountant"
    };

    const correctRole = userRoles[email?.toLowerCase()];
    
    if (!correctRole) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      email: email.toLowerCase(),
      correctRole,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get correct role',
      error: error.message
    });
  }
};