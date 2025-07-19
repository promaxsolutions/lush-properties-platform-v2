import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

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

  const httpServer = createServer(app);
  return httpServer;
}
