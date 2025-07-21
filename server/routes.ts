import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertTeamInvitationSchema, insertUserSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { z } from "zod";
import axios from "axios";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storageConfig,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new project
  app.post("/api/projects", upload.array('files'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const fileNames = files ? files.map(file => file.filename) : [];
      
      const projectData = {
        ...req.body,
        loanApproved: parseFloat(req.body.loanApproved) || 0,
        drawn: parseFloat(req.body.drawn) || 0,
        cashSpent: parseFloat(req.body.cashSpent) || 0,
        outstanding: parseFloat(req.body.outstanding) || 0,
        files: fileNames
      };

      const validatedData = insertProjectSchema.parse(projectData);
      const project = await storage.createProject(validatedData);
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Create project error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create project" });
      }
    }
  });

  // Update project
  app.put("/api/projects/:id", upload.array('files'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      let updateData = {
        ...req.body,
        loanApproved: req.body.loanApproved ? parseFloat(req.body.loanApproved) : undefined,
        drawn: req.body.drawn ? parseFloat(req.body.drawn) : undefined,
        cashSpent: req.body.cashSpent ? parseFloat(req.body.cashSpent) : undefined,
        outstanding: req.body.outstanding ? parseFloat(req.body.outstanding) : undefined,
      };

      // If new files are uploaded, add them to existing files
      if (files && files.length > 0) {
        const existingProject = await storage.getProject(id);
        const existingFiles = existingProject?.files || [];
        const newFiles = files.map(file => file.filename);
        updateData.files = [...existingFiles, ...newFiles];
      }

      const project = await storage.updateProject(id, updateData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Update project error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update project" });
      }
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Delete associated files
      if (project.files && project.files.length > 0) {
        project.files.forEach(fileName => {
          const filePath = path.join(uploadsDir, fileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Serve uploaded files
  app.get("/api/files/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Get project statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      
      const stats = {
        totalProjects: projects.length,
        totalLoanApproved: projects.reduce((sum, p) => sum + p.loanApproved, 0),
        totalCashSpent: projects.reduce((sum, p) => sum + p.cashSpent, 0),
        totalOutstanding: projects.reduce((sum, p) => sum + p.outstanding, 0),
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Claims API endpoint
  app.post("/api/claims", (req, res) => {
    try {
      const { projectId, projectName, stage, amount, lender, user } = req.body;
      
      // Mock claim creation - in real app this would save to database
      const claimId = `PCL-${Date.now()}-${projectId}`;
      
      console.log(`[CLAIMS] New claim created:`, {
        claimId,
        projectId,
        projectName,
        stage,
        amount,
        lender,
        user,
        createdAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        claimId,
        message: `Progress claim ${claimId} created successfully for ${projectName}. Amount: $${amount.toLocaleString()}. Lender: ${lender} will be notified.`,
        status: "pending_review"
      });
    } catch (error) {
      console.error("[CLAIMS] Error creating claim:", error);
      res.status(500).json({ error: "Failed to create claim" });
    }
  });

  // Email API endpoint
  app.post("/api/email", (req, res) => {
    try {
      const { to, subject, body, projectId } = req.body;
      
      // Mock email sending - in real app this would use SendGrid, Nodemailer, etc.
      console.log(`[EMAIL] Sending reminder:`, {
        to,
        subject,
        body: body.substring(0, 100) + "...",
        projectId,
        sentAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: "Reminder email sent successfully",
        emailId: `EMAIL-${Date.now()}`,
        sentTo: to
      });
    } catch (error) {
      console.error("[EMAIL] Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Notification API endpoint for internal notifications
  app.post("/api/notify", (req, res) => {
    try {
      const { to, subject, body, projectId } = req.body;
      
      // Mock internal notification - in real app this would use internal notification system
      console.log(`[NOTIFY] Sending internal notification:`, {
        to,
        subject,
        body: body.substring(0, 100) + "...",
        projectId,
        sentAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: "Internal notification sent successfully",
        notificationId: `NOTIFY-${Date.now()}`,
        sentTo: to
      });
    } catch (error) {
      console.error("[NOTIFY] Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Receipt parsing API endpoint
  app.post("/api/receipt-parse", (req, res) => {
    try {
      // Mock receipt parsing - in real app this would use OCR/AI services like AWS Textract, Google Vision, or Azure Form Recognizer
      const mockReceiptData = {
        project: "56 Inge King Crescent", // Default to first project
        amount: Math.floor(Math.random() * 5000) + 500, // Random amount $500-$5500
        description: "Construction materials and supplies",
        category: "Building Materials",
        vendor: "Bunnings Warehouse",
        date: new Date().toISOString().split('T')[0],
        confidence: 0.95
      };
      
      console.log(`[RECEIPT-PARSE] Processing receipt:`, {
        ...mockReceiptData,
        processedAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        ...mockReceiptData,
        message: "Receipt parsed successfully"
      });
    } catch (error) {
      console.error("[RECEIPT-PARSE] Error parsing receipt:", error);
      res.status(500).json({ error: "Failed to parse receipt" });
    }
  });

  // Xero sync API endpoint
  app.post("/api/xero-sync", (req, res) => {
    try {
      const { user, projectName, amount, description, category, receiptFile } = req.body;
      
      // Mock Xero sync - in real app this would use Xero API
      const xeroId = `XERO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      console.log(`[XERO-SYNC] Syncing with Xero:`, {
        user,
        projectName,
        amount,
        description,
        category,
        receiptFile,
        xeroId,
        syncedAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        xeroId,
        message: `Expense synced to Xero successfully`,
        status: "synced",
        xeroLink: `https://go.xero.com/app/expense/${xeroId}`
      });
    } catch (error) {
      console.error("[XERO-SYNC] Error syncing with Xero:", error);
      res.status(500).json({ error: "Failed to sync with Xero" });
    }
  });

  // Receipts API endpoint
  app.get("/api/receipts", (req, res) => {
    try {
      // Mock receipts data - in real app this would fetch from database
      const mockReceipts = [
        {
          id: "RECEIPT-1752941001",
          project: "56 Inge King Crescent",
          description: "Construction materials and supplies",
          amount: 2450,
          category: "Building Materials",
          vendor: "Bunnings Warehouse",
          date: "2025-01-15",
          link: "https://xero.com/receipt/RECEIPT-1752941001",
          xeroId: "XERO-1752941001-001"
        },
        {
          id: "RECEIPT-1752941002", 
          project: "Block 15 Section 87, Whitlam",
          description: "Plumbing fixtures and fittings",
          amount: 1850,
          category: "Plumbing",
          vendor: "Reece Plumbing",
          date: "2025-01-18",
          link: "https://xero.com/receipt/RECEIPT-1752941002",
          xeroId: "XERO-1752941002-002"
        }
      ];
      
      console.log(`[RECEIPTS] Fetching receipts:`, {
        count: mockReceipts.length,
        fetchedAt: new Date().toISOString()
      });
      
      res.json(mockReceipts);
    } catch (error) {
      console.error("[RECEIPTS] Error fetching receipts:", error);
      res.status(500).json({ error: "Failed to fetch receipts" });
    }
  });

  // Receipt update API endpoint
  app.post("/api/receipt-update", (req, res) => {
    try {
      const { id, field, value } = req.body;
      
      console.log(`[RECEIPT-UPDATE] Updating receipt:`, {
        id,
        field,
        value,
        updatedAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: `Receipt ${field} updated successfully`,
        updatedField: field,
        newValue: value
      });
    } catch (error) {
      console.error("[RECEIPT-UPDATE] Error updating receipt:", error);
      res.status(500).json({ error: "Failed to update receipt" });
    }
  });

  // Mobile receipt scanning API endpoint
  app.post("/api/receipt-scan", (req, res) => {
    try {
      const { receiptId } = req.body;
      
      // Mock mobile scanning - in real app this would use advanced mobile OCR
      const scanResults = {
        confidence: 0.98,
        quality: "High",
        textExtracted: "Bunnings Warehouse - Building supplies",
        detectedVendor: "Bunnings Warehouse",
        detectedAmount: Math.floor(Math.random() * 3000) + 200,
        mobileOptimized: true,
        scanDuration: "2.3s"
      };
      
      console.log(`[RECEIPT-SCAN] Mobile scanning receipt:`, {
        receiptId,
        ...scanResults,
        scannedAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        receiptId,
        ...scanResults,
        message: "Receipt scanned successfully via mobile"
      });
    } catch (error) {
      console.error("[RECEIPT-SCAN] Error scanning receipt:", error);
      res.status(500).json({ error: "Failed to scan receipt" });
    }
  });

  // Calendar events API endpoint
  app.get("/api/calendar-events", (req, res) => {
    try {
      // Mock calendar events - in real app this would fetch from calendar system
      const mockEvents = [
        {
          id: "EVENT-001",
          title: "Final Building Inspection",
          project: "56 Inge King Crescent",
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          time: "10:00 AM",
          type: "inspection",
          inspector: "ACT Building Authority"
        },
        {
          id: "EVENT-002", 
          title: "Slab Inspection",
          project: "Block 15 Section 87, Whitlam",
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          time: "2:00 PM",
          type: "inspection",
          inspector: "Independent Building Inspector"
        },
        {
          id: "EVENT-003",
          title: "Handover Meeting",
          project: "56 Inge King Crescent", 
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          time: "11:00 AM",
          type: "meeting",
          attendees: ["Client", "Builder", "Project Manager"]
        },
        {
          id: "EVENT-004",
          title: "Frame Inspection",
          project: "Block 15 Section 87, Whitlam",
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          time: "9:00 AM", 
          type: "inspection",
          inspector: "Structural Engineer"
        }
      ];
      
      console.log(`[CALENDAR-EVENTS] Fetching calendar events:`, {
        count: mockEvents.length,
        fetchedAt: new Date().toISOString()
      });
      
      res.json(mockEvents);
    } catch (error) {
      console.error("[CALENDAR-EVENTS] Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  // Project export PDF API endpoint
  app.get("/api/export-pdf/:projectId", (req, res) => {
    try {
      const { projectId } = req.params;
      
      // Mock PDF generation - in real app this would use a PDF library like PDFKit or Puppeteer
      const projectData = {
        id: projectId,
        title: `Project ${projectId} - Comprehensive Report`,
        generatedAt: new Date().toISOString(),
        financialSummary: {
          loanApproved: projectId === "1" ? 790000 : 400000,
          landCost: projectId === "1" ? 430000 : 280000,
          buildCost: projectId === "1" ? 360000 : 320000,
          projectedSale: projectId === "1" ? 1080000 : 720000
        },
        progress: projectId === "1" ? "85%" : "25%",
        stage: projectId === "1" ? "Stage 7 - Final Inspection" : "Stage 2 - Slab",
        documents: ["Land Contract", "Building Contract", "Council Approvals", "Insurance"],
        receipts: ["$2,450 - Concrete Supply", "$1,890 - Electrical Work", "$3,200 - Plumbing"],
        nextMilestones: ["Final Inspection", "Handover", "Settlement"]
      };
      
      // Mock PDF content (in real app this would be actual PDF binary data)
      const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
72 720 Td
(Lush Project Report - Project ${projectId}) Tj
0 -20 Td
(Generated: ${new Date().toLocaleDateString()}) Tj
0 -20 Td
(Financial Summary: $${projectData.financialSummary.loanApproved.toLocaleString()}) Tj
0 -20 Td
(Progress: ${projectData.progress}) Tj
0 -20 Td
(Stage: ${projectData.stage}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000189 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
440
%%EOF`;
      
      console.log(`[EXPORT-PDF] Generating PDF for project:`, {
        projectId,
        exportedAt: new Date().toISOString(),
        fileSize: `${pdfContent.length} bytes`
      });
      
      // Set PDF headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Lush_Project_${projectId}_Report.pdf"`);
      res.setHeader('Content-Length', pdfContent.length);
      
      res.send(Buffer.from(pdfContent));
    } catch (error) {
      console.error("[EXPORT-PDF] Error generating project export:", error);
      res.status(500).json({ error: "Failed to generate project export" });
    }
  });

  // AI funding check API endpoint
  app.post("/api/ai-funding-check", (req, res) => {
    try {
      const { projectName, budget, location, description } = req.body;
      
      // Mock AI analysis - in real app this would use OpenAI or similar AI service
      const analysisFactors = {
        locationScore: location.toLowerCase().includes('canberra') || location.toLowerCase().includes('act') ? 85 : Math.floor(Math.random() * 40) + 60,
        budgetScore: budget > 500000 ? 90 : budget > 300000 ? 75 : budget > 100000 ? 60 : 40,
        projectTypeScore: description.toLowerCase().includes('residential') ? 80 : description.toLowerCase().includes('commercial') ? 70 : 65,
        marketConditionsScore: 78 // Mock current market conditions
      };
      
      const overallScore = Math.floor(
        (analysisFactors.locationScore + analysisFactors.budgetScore + 
         analysisFactors.projectTypeScore + analysisFactors.marketConditionsScore) / 4
      );
      
      let recommendation = "";
      let message = "";
      
      if (overallScore >= 80) {
        recommendation = "Highly Recommended for Funding";
        message = "Excellent fundability potential. Strong location, appropriate budget, and favorable market conditions.";
      } else if (overallScore >= 65) {
        recommendation = "Recommended with Conditions";
        message = "Good fundability potential. Consider market timing and risk management strategies.";
      } else if (overallScore >= 50) {
        recommendation = "Proceed with Caution";
        message = "Moderate fundability. Recommend additional due diligence and risk assessment.";
      } else {
        recommendation = "Not Recommended";
        message = "Low fundability score. Consider revising project scope or market positioning.";
      }
      
      const result = {
        projectName,
        score: overallScore,
        recommendation,
        message,
        factors: analysisFactors,
        analysisDate: new Date().toISOString(),
        riskLevel: overallScore >= 75 ? "Low" : overallScore >= 60 ? "Medium" : "High"
      };
      
      console.log(`[AI-FUNDING-CHECK] Analysis completed:`, {
        projectName,
        score: overallScore,
        recommendation,
        analyzedAt: new Date().toISOString()
      });
      
      res.json(result);
    } catch (error) {
      console.error("[AI-FUNDING-CHECK] Error analyzing project fundability:", error);
      res.status(500).json({ error: "Failed to analyze project fundability" });
    }
  });

  // User invitation API endpoint
  app.post("/api/invite-user", (req, res) => {
    try {
      const { name, email, role, company } = req.body;
      
      // Mock invitation system - in real app this would send actual emails
      const inviteId = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const invitationData = {
        inviteId,
        name,
        email,
        role,
        company: company || "Lush Properties",
        invitedBy: "System Admin",
        invitedAt: new Date().toISOString(),
        status: "pending",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        inviteLink: `https://lush-portal.com/invite/${inviteId}`
      };
      
      // Mock email template
      const emailContent = `
Welcome to Lush Properties Platform!

Hi ${name},

You've been invited to join the Lush Properties project management platform as a ${role}.

Role: ${role}
Company: ${company || "Lush Properties"}
Invited by: System Admin

Click here to accept your invitation:
${invitationData.inviteLink}

This invitation expires in 7 days.

Best regards,
Lush Properties Team
      `;
      
      console.log(`[USER-INVITE] Invitation sent:`, {
        inviteId,
        name,
        email,
        role,
        invitedAt: new Date().toISOString(),
        emailContent: emailContent.substring(0, 100) + "..."
      });
      
      res.json({
        success: true,
        inviteId,
        message: `Invitation sent successfully to ${email}`,
        ...invitationData
      });
    } catch (error) {
      console.error("[USER-INVITE] Error sending user invitation:", error);
      res.status(500).json({ error: "Failed to send user invitation" });
    }
  });

  // Builder upload API endpoint
  app.post("/api/builder-upload", (req, res) => {
    try {
      const { projectId, uploadType, notes, filename } = req.body;
      
      // Mock file upload processing - in real app this would handle actual file storage
      const uploadId = `UPLOAD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const uploadData = {
        uploadId,
        projectId,
        uploadType,
        filename: filename || `${uploadType}_${Date.now()}.jpg`,
        notes: notes || "",
        uploadedBy: "Builder",
        uploadedAt: new Date().toISOString(),
        status: "processed",
        fileSize: Math.floor(Math.random() * 5000) + 1000 + " KB",
        processed: true
      };
      
      console.log(`[BUILDER-UPLOAD] File uploaded:`, {
        uploadId,
        projectId,
        uploadType,
        filename: uploadData.filename,
        uploadedAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        uploadId,
        message: `File uploaded successfully`,
        ...uploadData
      });
    } catch (error) {
      console.error("[BUILDER-UPLOAD] Error processing upload:", error);
      res.status(500).json({ error: "Failed to process upload" });
    }
  });

  // Client request API endpoint
  app.post("/api/client-request", (req, res) => {
    try {
      const { projectId, requestType, description, estimatedBudget } = req.body;
      
      // Mock request processing - in real app this would create workflow tickets
      const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const requestData = {
        requestId,
        projectId,
        requestType,
        description,
        estimatedBudget: estimatedBudget ? parseInt(estimatedBudget) : null,
        submittedBy: "Client",
        submittedAt: new Date().toISOString(),
        status: "pending_review",
        priority: estimatedBudget && parseInt(estimatedBudget) > 10000 ? "high" : "normal",
        estimatedResponse: "2-3 business days",
        assignedTo: "Project Manager"
      };
      
      console.log(`[CLIENT-REQUEST] Request submitted:`, {
        requestId,
        projectId,
        requestType,
        submittedAt: new Date().toISOString(),
        priority: requestData.priority
      });
      
      res.json({
        success: true,
        requestId,
        message: `Request submitted successfully`,
        ...requestData
      });
    } catch (error) {
      console.error("[CLIENT-REQUEST] Error processing request:", error);
      res.status(500).json({ error: "Failed to process client request" });
    }
  });

  // Push notification API endpoint
  app.post("/api/push-notification", (req, res) => {
    try {
      const { title, message, userId, projectId } = req.body;
      
      // Mock push notification sending - in real app this would use service worker/Firebase
      const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const notificationData = {
        notificationId,
        title,
        message,
        userId,
        projectId,
        sentAt: new Date().toISOString(),
        status: "delivered",
        type: "project_update",
        clickAction: projectId ? `/project/${projectId}` : "/dashboard"
      };
      
      console.log(`[PUSH-NOTIFICATION] Notification sent:`, {
        notificationId,
        title,
        userId,
        sentAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        notificationId,
        message: `Push notification sent successfully`,
        ...notificationData
      });
    } catch (error) {
      console.error("[PUSH-NOTIFICATION] Error sending notification:", error);
      res.status(500).json({ error: "Failed to send push notification" });
    }
  });

  // Mobile receipt processing API endpoint
  app.post("/api/process-receipt-mobile", (req, res) => {
    try {
      const { imageData, confidence, mobileCapture } = req.body;
      
      // Mock OCR processing - in real app this would use OCR service like Tesseract or AWS Textract
      const receiptId = `MOBILE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Simulate AI-powered receipt extraction
      const mockExtractedData = {
        receiptId,
        vendor: ["Bunnings Warehouse", "Home Depot", "Mitre 10", "Tool Station"][Math.floor(Math.random() * 4)],
        amount: (Math.random() * 500 + 50).toFixed(2),
        date: new Date().toISOString().split('T')[0],
        category: "Building Materials",
        confidence: confidence === "high" ? Math.random() * 0.15 + 0.85 : Math.random() * 0.3 + 0.7,
        mobileCapture: true,
        ocrMethod: "AI-powered mobile extraction",
        processedAt: new Date().toISOString()
      };
      
      console.log(`[MOBILE-RECEIPT] Receipt processed:`, {
        receiptId,
        vendor: mockExtractedData.vendor,
        amount: mockExtractedData.amount,
        confidence: mockExtractedData.confidence,
        mobileCapture: true
      });
      
      res.json({
        success: true,
        receiptId,
        message: "Mobile receipt processed successfully",
        ...mockExtractedData
      });
    } catch (error) {
      console.error("[MOBILE-RECEIPT] Error processing receipt:", error);
      res.status(500).json({ error: "Failed to process mobile receipt" });
    }
  });

  // AI Chat endpoint - ready for OpenAI integration
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // TODO: Replace with actual OpenAI API integration
      // Example OpenAI integration:
      // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      // const completion = await openai.chat.completions.create({
      //   model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      //   messages: [
      //     {
      //       role: "system",
      //       content: "You are a helpful project management assistant for construction projects. You have access to project data, uploads, and can help with claims, stages, and summaries."
      //     },
      //     {
      //       role: "user",
      //       content: prompt
      //     }
      //   ],
      //   max_tokens: 500
      // });
      // const reply = completion.choices[0].message.content;

      // Enhanced mock response with detailed project analysis
      let reply = "";
      
      if (prompt.includes('financial summary')) {
        // Smart project analysis based on the data in the prompt
        if (prompt.includes('56 Inge King') || prompt.includes('Land Cost: $650,000')) {
          reply = `**Profitability Analysis:** Strong project with estimated profit of $290,000 (26% ROI). 

**Risk Factors:** Near completion (85% progress) reduces construction risk. Market conditions favorable for Forrest location.

**Recommendations:** 
- Focus on final inspections and compliance
- Prepare marketing materials for sale
- Consider timing of market release for optimal pricing

**Financial Health:** Excellent loan-to-value ratio with substantial deposit buffer.`;
        } else if (prompt.includes('Whitlam') || prompt.includes('Land Cost: $280,000')) {
          reply = `**Profitability Analysis:** Solid early-stage project with projected profit of $120,000 (20% ROI).

**Risk Factors:** Early stage (25% progress) means higher construction and cost overrun risks. Whitlam is developing area with growth potential.

**Recommendations:**
- Monitor construction costs closely
- Ensure stage payments align with progress
- Consider market trends in outer Canberra areas

**Financial Health:** Conservative loan structure provides good safety margin.`;
        }
      } else if (prompt.toLowerCase().includes('next step') || prompt.toLowerCase().includes('recommended')) {
        // Handle AI next step recommendations
        if (prompt.includes('Stage 7') || prompt.includes('Fitout')) {
          reply = `**Next Step Recommendations for Final Stage:**

1. **Quality Inspections:** Coordinate final building inspections with council and certifiers
2. **Compliance Certificates:** Ensure all occupation certificates and compliance documentation is complete
3. **Marketing Preparation:** Professional photography and property styling for market presentation
4. **Legal Preparation:** Title documentation and settlement preparation with solicitors
5. **Market Timing:** Analyze current market conditions for optimal listing timing

**Priority Actions:**
- Schedule final inspection within 2 weeks
- Coordinate with marketing team for property presentation
- Prepare all settlement documentation

**Risk Mitigation:** Monitor any outstanding compliance items that could delay completion.`;
        } else if (prompt.includes('Stage 2') || prompt.includes('Slab')) {
          reply = `**Next Step Recommendations for Early Stage:**

1. **Construction Monitoring:** Regular site visits to ensure slab quality and timeline adherence
2. **Cost Control:** Track expenses against budget to prevent cost overruns
3. **Stage Payment Planning:** Prepare documentation for next progress payment to lender
4. **Weather Contingency:** Monitor weather conditions that could impact construction timeline
5. **Supplier Coordination:** Ensure next phase materials are ordered and scheduled

**Priority Actions:**
- Weekly progress reviews with builder
- Update project timeline based on current progress
- Prepare for frame inspection scheduling

**Risk Mitigation:** Early-stage projects require careful cost and timeline monitoring.`;
        } else {
          reply = `**General Next Step Recommendations:**

1. **Progress Review:** Assess current project status and timeline adherence
2. **Budget Analysis:** Review expenses and projected costs for remaining stages
3. **Stakeholder Communication:** Update all parties on project progress
4. **Risk Assessment:** Identify and mitigate potential project risks
5. **Planning Ahead:** Prepare for next phase requirements and approvals

**Key Focus Areas:**
- Maintain project momentum
- Ensure quality standards
- Monitor financial performance
- Communicate with team regularly`;
        }
      } else if (prompt.toLowerCase().includes('reminder') || prompt.toLowerCase().includes('urgent')) {
        // Handle AI reminder generation
        reply = `Subject: Urgent Action Required

Dear Team,

This is a professional reminder regarding the upcoming milestone for your project. Please prioritize the following action to keep the project on schedule:

**Required Action:** ${prompt.includes('next action:') ? prompt.split('next action:')[1].split('.')[0] : 'Complete pending task'}

**Project Status:** Currently in progress with attention needed for timely completion.

**Next Steps:**
1. Review current work status
2. Complete the required action
3. Update project team on progress
4. Schedule follow-up if needed

Please confirm completion at your earliest convenience.

Best regards,
Lush Properties Project Management`;
      } else if (prompt.toLowerCase().includes('upload')) {
        reply = "I can assist with document uploads and analysis. Navigate to the Uploads section to select your file.";
      } else if (prompt.toLowerCase().includes('claim')) {
        reply = "I can help generate progress claims for your projects. Access the Claims section to create new claims.";
      } else if (prompt.toLowerCase().includes('summarize')) {
        reply = "I can analyze and summarize uploaded documents including contracts and loan agreements.";
      } else {
        reply = "I'm here to help with project management tasks. Try asking about uploads, claims, or project summaries.";
      }

      res.json({ reply });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: "Failed to process AI request" });
    }
  });

  // Configure email transporter (for Nodemailer)
  const emailTransporter = nodemailer.createTransport({
    // Use Gmail or your preferred email service
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Team invitation routes
  app.post("/api/team/invite", async (req, res) => {
    try {
      const invitationSchema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        role: z.enum(['admin', 'broker', 'builder', 'client', 'investor', 'accountant']),
        projectId: z.number().optional(),
        createdBy: z.number()
      });

      const validatedData = invitationSchema.parse(req.body);
      
      // Create invitation in database
      const invitation = await storage.createTeamInvitation(validatedData);
      
      // Generate magic link
      const magicLink = `${req.protocol}://${req.get('host')}/magic/${invitation.magicToken}`;
      
      // Send email notification
      const firstName = invitation.name.split(' ')[0];
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🌍 Welcome to Lush OS!</h2>
          <p>Hi ${firstName},</p>
          <p>You've been added to Lush OS as a '<strong>${invitation.role}</strong>'.</p>
          <p>Click below to log in. Link expires in 72 hours.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px;">
              🔐 One-Click Login
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            No passwords needed! This secure link will log you in automatically.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">
            Link: ${magicLink}
          </p>
        </div>
      `;

      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER || 'noreply@lushos.io',
          to: invitation.email,
          subject: '🌍 Welcome to Lush OS - One-Click Access',
          html: emailHtml
        });
        
        console.log(`✉️  Invitation email sent to ${invitation.email}`);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails - invitation is still created
      }

      res.json({
        success: true,
        invitation: {
          id: invitation.id,
          name: invitation.name,
          email: invitation.email,
          role: invitation.role,
          magicLink,
          expiresAt: invitation.tokenExpiry
        },
        message: `Invitation sent to ${invitation.email}`
      });

    } catch (error) {
      console.error("Team invitation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid invitation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send invitation" });
      }
    }
  });

  // Magic link login - one-click access
  app.get("/api/magic/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ 
          message: "Invalid or expired magic link" 
        });
      }

      // Check if token has expired
      if (new Date() > invitation.tokenExpiry) {
        await storage.updateInvitationStatus(token, 'expired');
        return res.status(410).json({ 
          message: "This magic link has expired" 
        });
      }

      // Update last login and set as active
      await storage.updateLastLogin(token);

      // Return user context for frontend
      res.json({
        success: true,
        user: {
          email: invitation.email,
          name: invitation.name,
          firstName: invitation.name.split(' ')[0],
          role: invitation.role,
          projectId: invitation.projectId,
          magicToken: token
        },
        redirectTo: getRoleBasedRoute(invitation.role)
      });

    } catch (error) {
      console.error("Magic link validation error:", error);
      res.status(500).json({ message: "Failed to validate magic link" });
    }
  });

  // Helper function for role-based routing
  function getRoleBasedRoute(role: string): string {
    switch (role) {
      case 'client':
        return '/project-view';
      case 'builder':
        return '/builder';
      case 'investor':
        return '/investor-portal';
      case 'broker':
        return '/dashboard';
      case 'admin':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  }

  // Get current user context (for authenticated sessions)
  app.get("/api/auth/user", async (req, res) => {
    try {
      const magicToken = req.headers.authorization?.replace('Bearer ', '');
      
      if (!magicToken) {
        return res.status(401).json({ message: "No authentication token" });
      }

      const invitation = await storage.getInvitationByToken(magicToken);
      
      if (!invitation || invitation.status !== 'active') {
        return res.status(401).json({ message: "Invalid or inactive session" });
      }

      // Check if token is still valid
      if (new Date() > invitation.tokenExpiry) {
        await storage.updateInvitationStatus(magicToken, 'expired');
        return res.status(401).json({ message: "Session expired" });
      }

      res.json({
        email: invitation.email,
        name: invitation.name,
        firstName: invitation.name.split(' ')[0],
        role: invitation.role,
        projectId: invitation.projectId,
        lastLogin: invitation.lastLogin
      });

    } catch (error) {
      console.error("User context error:", error);
      res.status(500).json({ message: "Failed to get user context" });
    }
  });

  // Cleanup expired invitations (run manually or via cron)
  app.post("/api/admin/cleanup-invitations", async (req, res) => {
    try {
      const cleanedUp = await storage.cleanupExpiredInvitations();
      res.json({
        success: true,
        message: `Cleaned up ${cleanedUp} expired invitations`
      });
    } catch (error) {
      console.error("Cleanup error:", error);
      res.status(500).json({ message: "Failed to cleanup invitations" });
    }
  });

  // WhatsApp notification (optional - requires WhatsApp Cloud API)
  async function sendWhatsAppInvite(phoneNumber: string, firstName: string, role: string, magicLink: string) {
    try {
      const whatsappToken = process.env.WHATSAPP_TOKEN;
      const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;
      
      if (!whatsappToken || !whatsappPhoneId) {
        console.log("WhatsApp credentials not configured, skipping WhatsApp notification");
        return false;
      }

      const message = `Hi ${firstName}, you've been added to Lush OS as a '${role}'. Click below to log in. Link expires in 72 hours. 🌍 ${magicLink}`;
      
      await axios.post(`https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`, {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: { body: message }
      }, {
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return true;
    } catch (error) {
      console.error("WhatsApp sending failed:", error);
      return false;
    }
  }

  // Smart receipt upload with OCR processing
  app.post("/api/receipts/smart-upload", upload.single('image'), async (req, res) => {
    try {
      const { ocrText, extractedData, milestones } = req.body;
      
      // Save receipt data to database
      const receiptData = {
        ocrText,
        extractedData: typeof extractedData === 'string' ? JSON.parse(extractedData) : extractedData,
        milestones: typeof milestones === 'string' ? JSON.parse(milestones) : milestones,
        uploadedAt: new Date(),
        fileName: req.file?.filename || null
      };

      // Store in database (you can expand this based on your schema)
      console.log("📄 Smart receipt processed:", receiptData);

      res.json({
        success: true,
        message: "Receipt processed successfully",
        data: receiptData
      });

    } catch (error) {
      console.error("Smart receipt upload error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process receipt" 
      });
    }
  });

  // Milestone completion notification
  app.post("/api/notifications/milestone-complete", async (req, res) => {
    try {
      const { milestones, receipt } = req.body;
      
      console.log("🎯 Milestones completed:", milestones.map((m: any) => m.milestone));
      
      // Here you can send notifications, update project status, etc.
      // Example: Update project milestone status
      // await storage.updateProjectMilestones(projectId, milestones);

      res.json({
        success: true,
        message: "Milestone notifications sent"
      });

    } catch (error) {
      console.error("Milestone notification error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send milestone notifications" 
      });
    }
  });

  // WhatsApp reminder endpoint
  app.post("/api/notifications/whatsapp-reminder", async (req, res) => {
    try {
      const { message, recipient } = req.body;
      
      const success = await sendWhatsAppInvite(
        recipient, // Should be phone number, but using email for demo
        recipient.split('@')[0], // Extract name from email
        'builder',
        message
      );

      if (success) {
        console.log("📱 WhatsApp reminder sent to:", recipient);
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "WhatsApp not configured" });
      }

    } catch (error) {
      console.error("WhatsApp reminder error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send WhatsApp reminder" 
      });
    }
  });

  // General WhatsApp notification endpoint
  app.post("/api/notifications/whatsapp", async (req, res) => {
    try {
      const { recipient, message, type = 'text' } = req.body;
      
      // For demo purposes, log the message
      console.log(`📱 WhatsApp ${type} to ${recipient}: ${message}`);
      
      // In production, implement actual WhatsApp Cloud API call
      const success = await sendWhatsAppInvite(recipient, 'User', 'notification', message);
      
      res.json({
        success,
        message: success ? "WhatsApp sent successfully" : "WhatsApp service not available"
      });

    } catch (error) {
      console.error("WhatsApp API error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send WhatsApp message" 
      });
    }
  });

  // Save draft claim endpoint
  app.post("/api/claims/save-draft", async (req, res) => {
    try {
      const { lineItem, amount, description, receiptText, confidence } = req.body;
      
      // For demo purposes, store in memory or log
      const draftClaim = {
        id: Date.now().toString(),
        lineItem,
        amount,
        description,
        receiptText,
        confidence,
        status: 'draft',
        createdAt: new Date()
      };

      console.log("💾 Draft claim saved:", draftClaim);

      res.json({
        success: true,
        message: "Draft claim saved successfully",
        data: draftClaim
      });

    } catch (error) {
      console.error("Save draft claim error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to save draft claim" 
      });
    }
  });

  // Weekly reminder endpoint
  app.post("/api/notifications/weekly-reminder", async (req, res) => {
    try {
      const { recipient, message } = req.body;
      
      console.log("📅 Weekly reminder sent to:", recipient);
      console.log("📝 Message:", message);

      // Send via WhatsApp
      const success = await sendWhatsAppInvite(recipient, 'Builder', 'reminder', message);

      res.json({
        success: true,
        message: "Weekly reminder sent successfully"
      });

    } catch (error) {
      console.error("Weekly reminder error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send weekly reminder" 
      });
    }
  });

  // Get budget lines endpoint
  app.get("/api/budget/lines", async (req, res) => {
    try {
      // Sample budget data - in production, fetch from database
      const budgetLines = [
        { id: '1', name: 'Foundation Materials', keyword: 'concrete', amount: 15000, category: 'materials', remaining: 12000 },
        { id: '2', name: 'Framing Timber', keyword: 'timber', amount: 25000, category: 'materials', remaining: 22000 },
        { id: '3', name: 'Roofing Materials', keyword: 'roof', amount: 18000, category: 'materials', remaining: 18000 },
        { id: '4', name: 'Electrical Work', keyword: 'electrical', amount: 12000, category: 'labor', remaining: 8000 },
        { id: '5', name: 'Plumbing Work', keyword: 'plumbing', amount: 10000, category: 'labor', remaining: 7500 }
      ];

      res.json({
        success: true,
        data: budgetLines
      });

    } catch (error) {
      console.error("Get budget lines error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch budget lines" 
      });
    }
  });

  // Submit progress claim endpoint
  app.post("/api/claims/submit", upload.fields([
    { name: 'template', maxCount: 1 },
    { name: 'receipt', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { project, milestone, amount, lenderEmail, builderEmail, description, projectId } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      const claim = {
        id: Date.now().toString(),
        projectId: projectId || 'default',
        project,
        milestone,
        amount: parseFloat(amount),
        lenderEmail,
        builderEmail,
        description,
        files: {
          template: files?.template?.[0]?.filename,
          receipt: files?.receipt?.[0]?.filename,
          photo: files?.photo?.[0]?.filename
        },
        status: 'sent',
        submittedAt: new Date(),
        followUpCount: 0
      };

      console.log("📤 Progress claim submitted:", claim);

      // In production, this would:
      // 1. Save to database
      // 2. Send actual email to lender
      // 3. Set up follow-up automation

      // Simulate sending email
      console.log(`📧 Email sent to ${lenderEmail}:`);
      console.log(`Subject: Progress Claim - ${milestone} - ${project}`);
      console.log(`Amount: $${amount}`);
      console.log(`Attachments: ${Object.values(claim.files).filter(Boolean).length} files`);

      res.json({
        success: true,
        message: "Progress claim submitted successfully",
        data: claim
      });

    } catch (error) {
      console.error("Submit claim error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to submit progress claim" 
      });
    }
  });

  // Claim follow-up endpoint
  app.post("/api/claims/followup/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { milestone, amount } = req.body;
      
      console.log(`🔔 Follow-up reminder sent for project ${projectId}`);
      console.log(`Milestone: ${milestone}, Amount: $${amount}`);
      
      // In production, this would:
      // 1. Check if follow-up is needed (time elapsed, no response)
      // 2. Send reminder email to lender
      // 3. Update follow-up count in database
      // 4. Schedule next follow-up if needed

      res.json({
        success: true,
        message: "Follow-up reminder sent successfully"
      });

    } catch (error) {
      console.error("Claim follow-up error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send follow-up reminder" 
      });
    }
  });

  // Get claim status endpoint
  app.get("/api/claims/status/:projectId/:milestone", async (req, res) => {
    try {
      const { projectId, milestone } = req.params;
      
      // In production, fetch from database
      // For demo, return sample status
      const status = Math.random() > 0.7 ? 'approved' : 'sent';
      
      res.json({
        success: true,
        status,
        projectId,
        milestone
      });

    } catch (error) {
      console.error("Get claim status error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to get claim status" 
      });
    }
  });

  // Update claim status endpoint
  app.post("/api/claims/update-status", async (req, res) => {
    try {
      const { projectId, milestone, status } = req.body;
      
      console.log(`📋 Claim status updated: ${projectId} - ${milestone} - ${status}`);
      
      // In production, update database and notify relevant parties
      
      res.json({
        success: true,
        message: "Claim status updated successfully"
      });

    } catch (error) {
      console.error("Update claim status error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update claim status" 
      });
    }
  });

  // Get claim history endpoint
  app.get("/api/claims/history/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // Sample claim history
      const claims = [
        {
          id: '1',
          milestone: 'Foundation Complete',
          amount: 85000,
          status: 'approved',
          submittedAt: '2024-01-15',
          approvedAt: '2024-01-18'
        },
        {
          id: '2', 
          milestone: 'Frame Complete',
          amount: 120000,
          status: 'sent',
          submittedAt: '2024-02-10',
          followUpCount: 1
        }
      ];
      
      res.json({
        success: true,
        claims
      });

    } catch (error) {
      console.error("Get claim history error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to get claim history" 
      });
    }
  });

  // Lender response endpoint
  app.post("/api/claims/lender-response", async (req, res) => {
    try {
      const { claimId, action, response, lenderEmail } = req.body;
      
      console.log(`📋 Lender response received for claim ${claimId}:`);
      console.log(`Action: ${action}`);
      console.log(`Response: ${response}`);
      
      // In production, this would:
      // 1. Update claim status in database
      // 2. Send email notification to builder
      // 3. Update payment workflow if approved
      // 4. Log the response for audit trail

      // Simulate email to builder
      console.log("📧 Email notification sent to builder");
      console.log(`Subject: Claim ${action === 'approve' ? 'Approved' : 'Requires Changes'}`);
      
      res.json({
        success: true,
        message: `Claim ${action} response processed successfully`,
        data: {
          claimId,
          action,
          processedAt: new Date(),
          notificationSent: true
        }
      });

    } catch (error) {
      console.error("Lender response error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process lender response" 
      });
    }
  });



  // Security API endpoints
  
  // Token verification
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { token } = req.body;
      
      // In production, verify JWT token
      const isValid = token && token.length > 10;
      
      console.log(`🔐 Token verification: ${isValid ? 'VALID' : 'INVALID'}`);
      
      res.json({ valid: isValid });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({ valid: false });
    }
  });

  // Permission checking
  app.post("/api/auth/permissions", async (req, res) => {
    try {
      const { userId, action, resource } = req.body;
      
      // In production, check user permissions from database
      const hasPermission = userId && action && resource;
      
      console.log(`🛡️ Permission check: ${userId} - ${action} on ${resource}: ${hasPermission ? 'GRANTED' : 'DENIED'}`);
      
      res.json({ hasPermission });
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ hasPermission: false });
    }
  });

  // Audit logging
  app.post("/api/audit/log", async (req, res) => {
    try {
      const { userId, email, action, resource, details, timestamp, ipAddress, userAgent } = req.body;
      
      const auditEntry = {
        id: Date.now().toString(),
        userId,
        email,
        action,
        resource,
        details,
        timestamp,
        ipAddress,
        userAgent
      };
      
      console.log(`📋 AUDIT LOG: ${email} - ${action} - ${resource} at ${timestamp}`);
      console.log(`   IP: ${ipAddress}, Details:`, details);
      
      // In production, save to secure audit database
      
      res.json({ success: true, auditId: auditEntry.id });
    } catch (error) {
      console.error("Audit logging error:", error);
      res.status(500).json({ success: false });
    }
  });

  // Get audit logs
  app.get("/api/audit/logs", async (req, res) => {
    try {
      const { userId, limit = 100 } = req.query;
      
      // Sample audit logs
      const sampleLogs = [
        {
          id: "1",
          userId: userId || "user123",
          email: "user@example.com",
          action: "SECURE_UPLOAD",
          resource: "Project: proj-001",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ipAddress: "192.168.1.100",
          details: { filename: "progress_photo.jpg", fileSize: 2048576 }
        },
        {
          id: "2", 
          userId: userId || "user123",
          email: "user@example.com",
          action: "ACCESS_PROJECT",
          resource: "proj-001",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ipAddress: "192.168.1.100",
          details: { projectName: "Luxury Townhouse", userRole: "builder" }
        },
        {
          id: "3",
          userId: userId || "user123", 
          email: "user@example.com",
          action: "ESIGNATURE_REQUEST",
          resource: "claim-456",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          ipAddress: "192.168.1.100",
          details: { documentType: "progress_claim", expiresAt: new Date(Date.now() + 86400000).toISOString() }
        }
      ];
      
      res.json({
        success: true,
        logs: sampleLogs.slice(0, parseInt(limit as string))
      });
    } catch (error) {
      console.error("Get audit logs error:", error);
      res.status(500).json({ success: false, logs: [] });
    }
  });

  // Secure file upload with hash and fraud detection
  app.post("/api/upload/secure", upload.single('file'), async (req, res) => {
    try {
      const { projectId, userEmail } = req.body;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ success: false, message: "No file provided" });
      }
      
      // Generate secure hash
      const hash = require('crypto').createHash('sha256').update(file.buffer || file.filename).digest('hex');
      
      // AI fraud detection simulation
      const fraudScore = Math.random() * 0.5; // Random score 0-0.5
      const fraudFlags = fraudScore > 0.3 ? ['suspicious_metadata'] : [];
      
      const result = {
        success: true,
        fileId: `file_${Date.now()}`,
        hash: hash,
        uploadedBy: userEmail,
        timestamp: new Date().toISOString(),
        fraud_score: fraudScore,
        fraud_flags: fraudFlags
      };
      
      console.log(`📁 SECURE UPLOAD: ${file.originalname}`);
      console.log(`   Hash: ${hash}`);
      console.log(`   Uploader: ${userEmail}`);
      console.log(`   Fraud Score: ${(fraudScore * 100).toFixed(1)}%`);
      
      res.json(result);
    } catch (error) {
      console.error("Secure upload error:", error);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });

  // E-signature request with OTP
  app.post("/api/esignature/request", async (req, res) => {
    try {
      const { documentId, recipientEmail, documentType, expiresIn } = req.body;
      
      const requestId = `esign_${Date.now()}`;
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + expiresIn).toISOString();
      
      console.log(`🖊️ E-SIGNATURE REQUEST: ${documentId}`);
      console.log(`   Recipient: ${recipientEmail}`);
      console.log(`   OTP Code: ${otpCode}`);
      console.log(`   Expires: ${expiresAt}`);
      
      // In production: Send email with OTP code
      
      res.json({
        success: true,
        requestId,
        expiresAt,
        message: "E-signature request sent with OTP"
      });
    } catch (error) {
      console.error("E-signature request error:", error);
      res.status(500).json({ success: false });
    }
  });

  // OTP verification for e-signature
  app.post("/api/esignature/verify-otp", async (req, res) => {
    try {
      const { requestId, otpCode, userEmail } = req.body;
      
      // In production: verify OTP against database
      const isValidOTP = otpCode && otpCode.length === 6;
      
      if (isValidOTP) {
        const signatureId = `sig_${Date.now()}`;
        
        console.log(`✅ E-SIGNATURE COMPLETED: ${requestId}`);
        console.log(`   Signature ID: ${signatureId}`);
        console.log(`   Signer: ${userEmail}`);
        
        res.json({
          success: true,
          signatureId,
          signedAt: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid OTP code"
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ success: false });
    }
  });

  // Fraud detection for receipts
  app.post("/api/fraud/scan-receipt", upload.single('receipt'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ success: false, message: "No receipt provided" });
      }
      
      // AI fraud detection simulation
      const fraudScore = Math.random();
      const confidence = 0.85 + Math.random() * 0.15;
      
      const flags = [];
      if (fraudScore > 0.7) flags.push('high_risk_vendor');
      if (fraudScore > 0.5) flags.push('unusual_amount');
      if (fraudScore > 0.3) flags.push('suspicious_timing');
      
      const result = {
        success: true,
        fraudScore,
        flags,
        confidence,
        details: {
          fileName: file.originalname,
          fileSize: file.size,
          scanTimestamp: new Date().toISOString()
        }
      };
      
      console.log(`🔍 FRAUD SCAN: ${file.originalname}`);
      console.log(`   Fraud Score: ${(fraudScore * 100).toFixed(1)}%`);
      console.log(`   Flags: ${flags.join(', ') || 'None'}`);
      
      res.json(result);
    } catch (error) {
      console.error("Fraud scan error:", error);
      res.status(500).json({ success: false });
    }
  });

  // Secure invite creation
  app.post("/api/invites/create", async (req, res) => {
    try {
      const { email, role, projectId, expiresIn } = req.body;
      
      const inviteId = `invite_${Date.now()}`;
      const expiresAt = new Date(Date.now() + expiresIn).toISOString();
      
      console.log(`📨 INVITE CREATED: ${email}`);
      console.log(`   Role: ${role}`);
      console.log(`   Expires: ${expiresAt}`);
      
      // In production: Save to database with expiry
      
      res.json({
        success: true,
        inviteId,
        expiresAt,
        inviteUrl: `${req.protocol}://${req.hostname}/invite/${inviteId}`
      });
    } catch (error) {
      console.error("Invite creation error:", error);
      res.status(500).json({ success: false });
    }
  });

  // Validate invite
  app.get("/api/invites/validate/:inviteId", async (req, res) => {
    try {
      const { inviteId } = req.params;
      
      // In production: Check database for invite and expiry
      const isExpired = Math.random() > 0.8; // 20% chance expired for demo
      
      if (isExpired) {
        res.json({
          valid: false,
          expired: true,
          message: "Invite link has expired"
        });
      } else {
        res.json({
          valid: true,
          email: "user@example.com",
          role: "builder",
          projectId: "proj-001"
        });
      }
    } catch (error) {
      console.error("Invite validation error:", error);
      res.status(500).json({ valid: false });
    }
  });

  // Get client IP
  app.get("/api/client-ip", (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    res.json({ ip });
  });

  // Trigger e-signature for claims
  app.post("/api/claims/trigger-esignature", async (req, res) => {
    try {
      const { claimId, projectId, milestone, amount, lenderEmail, builderEmail } = req.body;
      
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
      
      console.log(`🖊️ CLAIM E-SIGNATURE TRIGGERED: ${claimId}`);
      console.log(`   Milestone: ${milestone}`);
      console.log(`   Amount: $${amount}`);
      console.log(`   OTP: ${otpCode}`);
      console.log(`   Expires: ${expiresAt}`);
      
      // In production: Send email to lender with OTP
      
      res.json({
        success: true,
        requestId: `esign_claim_${claimId}_${Date.now()}`,
        expiresAt,
        message: "E-signature request sent to lender"
      });
    } catch (error) {
      console.error("Claim e-signature trigger error:", error);
      res.status(500).json({ success: false });
    }
  });

  // Project AI endpoints

  // Get project timeline
  app.get("/api/projects/timeline/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // Sample timeline data
      const timeline = [
        {
          id: '1',
          title: 'Project Initiation',
          description: 'Project planning, permits, and site preparation completed',
          date: '2024-01-15',
          status: 'completed',
          stage: 'Planning',
          confidence: 1.0
        },
        {
          id: '2',
          title: 'Site Preparation',
          description: 'Excavation and site leveling completed',
          date: '2024-01-22',
          status: 'completed',
          stage: 'Site Prep',
          confidence: 0.95
        },
        {
          id: '3',
          title: 'Foundation Complete',
          description: 'Concrete foundation poured and cured successfully',
          date: '2024-02-05',
          status: 'completed',
          stage: 'Foundation',
          confidence: 0.98
        },
        {
          id: '4',
          title: 'Frame Construction',
          description: 'Timber frame installation in progress',
          date: '2024-02-20',
          status: 'in-progress',
          stage: 'Framing',
          confidence: 0.87
        },
        {
          id: '5',
          title: 'Roofing Installation',
          description: 'Roof structure and weatherproofing to begin',
          date: '2024-03-10',
          status: 'upcoming',
          stage: 'Roofing',
          confidence: 0.75
        }
      ];
      
      console.log(`📊 Timeline requested for project: ${projectId}`);
      
      res.json({
        success: true,
        timeline
      });
    } catch (error) {
      console.error("Get timeline error:", error);
      res.status(500).json({ success: false, timeline: [] });
    }
  });

  // AI stage detection
  app.post("/api/ai/detect-stage/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // AI stage detection simulation
      const stages = [
        'Planning & Design',
        'Site Preparation',
        'Foundation Complete',
        'Frame Construction (In Progress)',
        'Lockup Complete',
        'Roofing Complete'
      ];
      
      const currentStage = stages[3]; // Frame Construction
      const confidence = 0.87 + Math.random() * 0.1;
      
      const stageData = {
        label: currentStage,
        confidence: Math.min(confidence, 0.99),
        nextMilestone: 'Lockup Complete',
        daysRemaining: 18,
        aiRecommendations: [
          'Continue timber frame installation as per schedule',
          'Schedule building inspection for frame completion',
          'Prepare materials for lockup phase',
          'Monitor weather conditions for optimal work days'
        ]
      };
      
      console.log(`🧠 AI STAGE DETECTION: ${projectId}`);
      console.log(`   Detected Stage: ${currentStage}`);
      console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`);
      
      res.json({
        success: true,
        stage: stageData
      });
    } catch (error) {
      console.error("Stage detection error:", error);
      res.status(500).json({ success: false });
    }
  });

  // AI photo analysis
  app.post("/api/ai/analyze-photos/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // AI photo analysis simulation
      const analysisData = {
        stageConfidence: 0.85 + Math.random() * 0.1,
        detectedElements: ['foundation', 'concrete_work', 'timber_frame', 'structural_beams'],
        progressPercentage: 65 + Math.floor(Math.random() * 20),
        qualityScore: 7.8 + Math.random() * 1.5,
        recommendations: [
          'Continue with current quality standards',
          'Schedule next milestone inspection',
          'Monitor structural alignment',
          'Document progress for compliance'
        ]
      };
      
      console.log(`📸 AI PHOTO ANALYSIS: ${projectId}`);
      console.log(`   Progress: ${analysisData.progressPercentage}%`);
      console.log(`   Quality Score: ${analysisData.qualityScore.toFixed(1)}/10`);
      
      res.json({
        success: true,
        ...analysisData
      });
    } catch (error) {
      console.error("Photo analysis error:", error);
      res.status(500).json({ success: false });
    }
  });

  // AI milestone prediction
  app.post("/api/ai/predict-milestone/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // AI milestone prediction simulation
      const predictionData = {
        milestone: 'Lockup Complete',
        estimatedDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        requirements: [
          'Complete frame inspection',
          'Install exterior wall sheathing',
          'Install windows and doors',
          'Weather protection measures'
        ],
        riskFactors: [
          'Weather dependency for exterior work',
          'Material delivery scheduling',
          'Building inspection availability'
        ]
      };
      
      console.log(`🎯 AI MILESTONE PREDICTION: ${projectId}`);
      console.log(`   Next Milestone: ${predictionData.milestone}`);
      console.log(`   Estimated Date: ${predictionData.estimatedDate}`);
      
      res.json({
        success: true,
        ...predictionData
      });
    } catch (error) {
      console.error("Milestone prediction error:", error);
      res.status(500).json({ success: false });
    }
  });

  // Auto-cleanup expired invitations every 12 hours
  setInterval(async () => {
    try {
      const cleanedUp = await storage.cleanupExpiredInvitations();
      if (cleanedUp > 0) {
        console.log(`🧹 Auto-cleanup: Removed ${cleanedUp} expired magic links`);
      }
    } catch (error) {
      console.error("Auto-cleanup error:", error);
    }
  }, 12 * 60 * 60 * 1000); // 12 hours

  const httpServer = createServer(app);
  return httpServer;
}
