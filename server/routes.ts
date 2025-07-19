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

  const httpServer = createServer(app);
  return httpServer;
}
