import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, DollarSign, Building, TrendingUp, PiggyBank, Target, Edit2, ExternalLink, Lightbulb, Save, X, RefreshCw, BarChart3, TrendingUp as TrendIcon, Mail, Bell, Calendar as CalendarIcon, Clock, AlertCircle, Brain } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Mock project data with deposits and role assignments
const initialProjects = [
  {
    id: 1,
    name: "56 Inge King Crescent",
    address: "56 Inge King Crescent, Forrest ACT 2603",
    lender: "Commonwealth Bank",
    stage: "Stage 7 - Fitout",
    loanApproved: 1100000,
    landCost: 650000,
    buildCost: 450000,
    userDeposit: 150000,
    progressPercentage: 85,
    documentsCount: 12,
    nextAction: "Final inspection scheduled",
    claimsRaised: 935000,
    builderEmail: "builder@example.com",
    clientEmail: "client@example.com",
    investorEmails: ["investor1@example.com", "investor2@example.com"]
  },
  {
    id: 2,
    name: "Block 15 Section 87, Whitlam",
    address: "Block 15 Section 87, Whitlam ACT 2611",
    lender: "Westpac Banking",
    stage: "Stage 2 - Slab",
    loanApproved: 400000,
    landCost: 280000,
    buildCost: 320000,
    userDeposit: 80000,
    progressPercentage: 25,
    documentsCount: 8,
    nextAction: "Slab inspection due",
    claimsRaised: 200000,
    builderEmail: "builder@example.com",
    clientEmail: "otherclient@example.com",
    investorEmails: ["investor3@example.com"]
  }
];

const LushDashboard = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDeposit, setEditingDeposit] = useState(0);
  const [aiTips, setAiTips] = useState<Record<number, string>>({});
  const [loadingTips, setLoadingTips] = useState<Record<number, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showNav, setShowNav] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [showSmartAlerts, setShowSmartAlerts] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(true);
  
  // Mock user context - in real app this would come from auth context
  const [localRole, setLocalRole] = useState("admin"); // Role switching for testing
  const [alerts, setAlerts] = useState<string[]>([
    "📬 Builder notified of pending claim",
    "✅ Client upgrade request confirmed", 
    "🧠 AI: Estimated completion in 9 weeks"
  ]);
  const [aiInsights, setAiInsights] = useState<string[]>([
    "💸 AI Suggests: ORDE loan 4.99% fixed is best option (saves $22K)",
    "🧱 Builder 'MacHomes' has 4.7 star reliability, 3.9 on timelines",
    "📈 Fundability: 8.7/10 — Project primed for investor proposal",
    "📤 Smart reply sent to builder: 'Plumbing final due this week'",
    "🚨 Cost Alert: Roofing quote is 12% above average in Whitlam"
  ]);
  const userRole = localRole; // Use localRole for role-based filtering
  const userEmail = "admin@lushproperties.com"; // Mock user email
  const firstName = "Alex"; // Mock user first name

  // Enhanced setup with offline detection and mobile navigation
  React.useEffect(() => {
    // Push notifications setup
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("🔔 Push notifications enabled for Lush OS");
        }
      });
    }

    // Mobile navigation auto-hide
    if (window.innerWidth < 640) {
      setShowNav(false);
    }

    // Online/offline detection
    const handleOnline = () => {
      setSyncStatus('online');
      notifyUser("🌐 Back Online", "Data sync resumed");
      processOfflineQueue();
    };
    
    const handleOffline = () => {
      setSyncStatus('offline');
      notifyUser("📱 Offline Mode", "Changes will sync when connection returns");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process offline queue when back online
  const processOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    
    setSyncStatus('syncing');
    notifyUser("🔄 Syncing Data", `Processing ${offlineQueue.length} offline changes`);
    
    try {
      for (const item of offlineQueue) {
        await fetch(item.endpoint, {
          method: item.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data)
        });
      }
      setOfflineQueue([]);
      setSyncStatus('online');
      notifyUser("✅ Sync Complete", "All offline changes synchronized");
    } catch (error) {
      console.error('Sync failed:', error);
      notifyUser("❌ Sync Failed", "Some changes couldn't be synchronized");
    }
  };

  // Add to offline queue when no connection
  const queueOfflineAction = (endpoint: string, method: string, data: any) => {
    const queueItem = {
      id: Date.now(),
      endpoint,
      method,
      data,
      timestamp: new Date().toISOString()
    };
    setOfflineQueue(prev => [...prev, queueItem]);
    notifyUser("💾 Saved Offline", "Changes queued for sync when online");
  };

  // Utility functions for maps and notifications
  const notifyUser = (title: string, message: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { 
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "lush-os-notification"
      });
    }
  };

  const renderMapLink = (address: string) => {
    const encoded = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  };

  const handleMapClick = (project: any) => {
    notifyUser("📍 Opening Maps", `Opening ${project.address} in Google Maps`);
    window.open(renderMapLink(project.address), '_blank');
  };

  // Mobile camera capture functionality
  const handleCameraCapture = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', // Use back camera for receipts
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        setCameraEnabled(true);
        notifyUser("📷 Camera Ready", "Camera activated for receipt capture");
        
        // In a real implementation, this would show a camera preview
        // For demo purposes, we'll simulate capturing an image
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          setCameraEnabled(false);
          setCapturedImage("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...");
          notifyUser("✅ Photo Captured", "Receipt photo ready for processing");
        }, 3000);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      notifyUser("❌ Camera Error", "Unable to access camera. Please allow camera permissions.");
    }
  };

  // Process captured receipt with OCR
  const processReceiptPhoto = async (imageData: string) => {
    try {
      const response = await fetch("/api/process-receipt-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageData,
          confidence: "high",
          mobileCapture: true
        })
      });
      const result = await response.json();
      notifyUser("🔍 Receipt Processed", `Vendor: ${result.vendor}, Amount: $${result.amount}`);
      setCapturedImage(null);
    } catch (error) {
      console.error('Receipt processing failed:', error);
      notifyUser("❌ Processing Failed", "Unable to process receipt. Please try again.");
    }
  };

  // Fetch receipts data
  const fetchReceipts = async () => {
    try {
      const response = await fetch("/api/receipts");
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    }
  };

  // Filter projects based on user role
  const filteredProjects = projects.filter(project => {
    if (userRole === "builder") {
      return project.builderEmail === userEmail;
    } else if (userRole === "client") {
      return project.clientEmail === userEmail;
    } else if (userRole === "investor") {
      return project.investorEmails?.includes(userEmail);
    }
    return true; // Admin, broker, solicitor see all projects
  });

  // Calculate global summary from filtered projects including deposits
  const globalSummary = {
    totalLoanApproved: filteredProjects.reduce((sum, p) => sum + p.loanApproved, 0),
    totalProjectedSales: filteredProjects.reduce((sum, p) => sum + (p.id === 1 ? 1080000 : 720000), 0),
    totalInvestment: filteredProjects.reduce((sum, p) => sum + p.landCost + p.buildCost, 0),
    totalUserDeposit: filteredProjects.reduce((sum, p) => sum + p.userDeposit, 0),
    totalClaimsRaised: filteredProjects.reduce((sum, p) => sum + p.claimsRaised, 0),
    netEquity: filteredProjects.reduce((sum, p) => sum + (p.id === 1 ? 1080000 : 720000), 0) - filteredProjects.reduce((sum, p) => sum + p.loanApproved, 0) + filteredProjects.reduce((sum, p) => sum + p.userDeposit, 0)
  };

  const handleEdit = (projectId: number, currentName: string, currentDeposit: number) => {
    setEditingProjectId(projectId);
    setEditingName(currentName);
    setEditingDeposit(currentDeposit);
  };

  const handleSave = async (projectId: number) => {
    // In real app, this would make API call
    // await fetch(`/api/projects/${projectId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: editingName, userDeposit: editingDeposit })
    // });

    setProjects(prev => 
      prev.map(p => 
        p.id === projectId ? { ...p, name: editingName, userDeposit: editingDeposit } : p
      )
    );
    setEditingProjectId(null);
    setEditingName("");
    setEditingDeposit(0);
  };

  const handleCancel = () => {
    setEditingProjectId(null);
    setEditingName("");
    setEditingDeposit(0);
  };

  const fetchAIInsight = async (project: any, isRefresh = false) => {
    setLoadingTips(prev => ({ ...prev, [project.id]: true }));
    
    try {
      const prompt = `This is a financial summary of a real estate development project:
- Project: ${project.name}
- Land Cost: $${project.landCost.toLocaleString()}
- Build Cost: $${project.buildCost.toLocaleString()}
- Loan Approved: $${project.loanApproved.toLocaleString()}
- User Deposit: $${project.userDeposit.toLocaleString()}
- Projected Sale Price: $${(1800000 * (project.id === 1 ? 0.6 : 0.4)).toLocaleString()}
- Current Stage: ${project.stage}
- Progress: ${project.progressPercentage}%

Give me a brief insight into potential profitability, risk factors, and recommendations for this stage of development.`;

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      setAiTips(prev => ({ ...prev, [project.id]: data.reply }));
    } catch (error) {
      setAiTips(prev => ({ ...prev, [project.id]: "Unable to get AI analysis at this time." }));
    }
    
    setLoadingTips(prev => ({ ...prev, [project.id]: false }));
  };

  // Auto-fetch AI insights on component mount
  useEffect(() => {
    projects.forEach(project => {
      // Only fetch if we don't already have an insight for this project
      if (!aiTips[project.id]) {
        fetchAIInsight(project);
      }
    });
  }, [projects.length]); // Re-run if projects change

  // Chart data configuration
  const equityChartData = {
    labels: projects.map(p => p.name.split(' ')[0] + '...'), // Shortened names for charts
    datasets: [
      {
        label: "Loan Approved",
        data: projects.map(p => p.loanApproved),
        backgroundColor: "#10b981",
        borderRadius: 4,
      },
      {
        label: "Total Investment",
        data: projects.map(p => p.landCost + p.buildCost + p.userDeposit),
        backgroundColor: "#f59e0b",
        borderRadius: 4,
      },
      {
        label: "Projected Sale",
        data: projects.map(p => (1800000 * (p.id === 1 ? 0.6 : 0.4))),
        backgroundColor: "#3b82f6",
        borderRadius: 4,
      }
    ]
  };

  const progressTimelineData = {
    labels: projects.map(p => p.name.split(' ')[0] + '...'),
    datasets: [
      {
        label: "Progress %",
        data: projects.map(p => p.progressPercentage),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
  };

  const timelineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
  };

  const createGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const handleRaiseClaim = async (project: any) => {
    try {
      const claimData = {
        projectId: project.id,
        projectName: project.name,
        stage: project.stage,
        amount: Math.round(project.loanApproved * 0.15), // 15% of loan for this stage
        lender: project.lender,
        progress: project.progressPercentage,
        user: userEmail
      };

      // API call to create claim with backend integration
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claimData)
      });
      
      const result = await response.json();
      alert(result.message || `Progress claim created for ${project.name}\nStage: ${project.stage}\nAmount: $${claimData.amount.toLocaleString()}\nClaim ID: ${result.claimId || 'PCL-' + Date.now()}`);
      
    } catch (error) {
      console.error('Failed to create claim:', error);
      alert('Failed to create progress claim. Please try again.');
    }
  };

  const sendAIReminder = async (project: any) => {
    try {
      // Generate AI reminder content
      const reminderResponse = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a polite but urgent reminder to the builder or contractor about the next action: ${project.nextAction} for ${project.name}. The project is currently at ${project.stage} (${project.progressPercentage}% complete). Make it professional and actionable.`
        })
      });
      
      const reminderData = await reminderResponse.json();
      
      // Send email via backend
      const emailResponse = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: `contractor@${project.name.toLowerCase().replace(/\s+/g, '')}.com`, // Mock contractor email
          subject: `Action Required: ${project.name} - ${project.stage}`,
          body: reminderData.reply,
          projectId: project.id
        })
      });
      
      const emailResult = await emailResponse.json();
      alert(`AI reminder sent successfully!\n\nTo: contractor@${project.name.toLowerCase().replace(/\s+/g, '')}.com\nSubject: Action Required: ${project.name}\n\nMessage: ${reminderData.reply.substring(0, 100)}...`);
      
    } catch (error) {
      console.error('Failed to send reminder:', error);
      alert('Failed to send AI reminder. Please try again.');
    }
  };

  const sendAINextStep = async (project: any) => {
    try {
      // Generate AI next step recommendations
      const nextStepResponse = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `What is the recommended next step in a real estate project at stage: ${project.stage} with this current task: ${project.nextAction}? Provide specific, actionable recommendations for ${project.name} at ${project.progressPercentage}% completion.`
        })
      });
      
      const nextStepData = await nextStepResponse.json();
      
      // Send notification to user
      const notifyResponse = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail,
          subject: `Next Step Recommendations for ${project.name}`,
          body: nextStepData.reply,
          projectId: project.id
        })
      });
      
      const notifyResult = await notifyResponse.json();
      alert(`AI next step recommendations sent!\n\nTo: ${userEmail}\nSubject: Next Step for ${project.name}\n\nRecommendations: ${nextStepData.reply.substring(0, 100)}...`);
      
    } catch (error) {
      console.error('Failed to send next step:', error);
      alert('Failed to generate next step recommendations. Please try again.');
    }
  };

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("receipt", file);

      // Parse receipt using AI/OCR
      const receiptResponse = await fetch("/api/receipt-parse", {
        method: "POST",
        body: formData
      });
      
      const receiptData = await receiptResponse.json();
      
      // Sync with Xero
      const xeroResponse = await fetch("/api/xero-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userEmail,
          projectName: receiptData.project,
          amount: receiptData.amount,
          description: receiptData.description,
          category: receiptData.category,
          receiptFile: file.name
        })
      });
      
      const xeroResult = await xeroResponse.json();
      alert(`Receipt uploaded and synced with Xero!\n\nProject: ${receiptData.project}\nAmount: $${receiptData.amount}\nCategory: ${receiptData.category}\nXero ID: ${xeroResult.xeroId || 'XERO-' + Date.now()}`);
      
    } catch (error) {
      console.error('Failed to upload receipt:', error);
      alert('Failed to upload receipt. Please try again.');
    } finally {
      setUploading(false);
      fetchReceipts(); // Refresh receipts after upload
    }
  };

  const updateSpend = async (receiptId: string, field: string, value: string) => {
    try {
      await fetch("/api/receipt-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: receiptId,
          field,
          value
        })
      });
      fetchReceipts(); // Refresh receipts after update
    } catch (error) {
      console.error('Failed to update receipt:', error);
    }
  };

  // Fetch calendar events
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/calendar-events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  // Handle calendar day click
  const handleCalendarClick = (date: Date) => {
    setSelectedDate(date);
    const event = events.find((e: any) => 
      new Date(e.date).toDateString() === date.toDateString()
    );
    if (event) {
      alert(`🔔 ${event.title} at ${event.time}\nProject: ${event.project}`);
    }
  };

  // Builder breakdown for pie chart
  const builderBreakdown = () => {
    const byBuilder: Record<string, number> = {};
    receipts.forEach((r: any) => {
      const key = r.builder || "Unknown";
      byBuilder[key] = (byBuilder[key] || 0) + parseFloat(r.amount || 0);
    });
    return {
      labels: Object.keys(byBuilder),
      datasets: [{
        label: "Spend per Builder",
        data: Object.values(byBuilder),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
      }]
    };
  };

  // Handle AI funding proposal review
  const handleAIProposalReview = async (formData: any) => {
    try {
      const response = await fetch("/api/ai-funding-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert(`🧠 AI Fundability Analysis: ${result.message}\n\nScore: ${result.score}/100\nRecommendation: ${result.recommendation}`);
    } catch (error) {
      console.error('Failed to get AI funding review:', error);
      alert('Failed to analyze project fundability. Please try again.');
    }
  };

  // Handle builder/agent onboarding
  const handleUserInvite = async (userData: any) => {
    try {
      const response = await fetch("/api/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      alert(`✅ Invitation sent successfully to ${userData.email}\n\nRole: ${userData.role}\nInvite ID: ${result.inviteId}`);
    } catch (error) {
      console.error('Failed to send user invite:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  // Handle project export for investors and admins
  const handleExportProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/export-pdf/${projectId}`, {
        method: "GET",
        headers: { "Content-Type": "application/pdf" }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Lush_Project_${projectId}_Report.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        alert("Project export downloaded successfully!");
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error('Failed to export project:', error);
      alert('Failed to export project. Please try again.');
    }
  };

  // Get current time for display
  const localTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Render project status helper
  const renderStatus = (project: any) => {
    const stages = ["Land Settled", "Slab", "Framing", "Lockup", "Fixing", "C of O"];
    const currentStageIndex = Math.floor((project.progressPercentage || 0) / 16.67); // 6 stages = ~16.67% each
    const nextStage = stages[currentStageIndex + 1] || "Complete";
    return `Next: ${nextStage}`;
  };

  // Handle builder uploads
  const handleBuilderUpload = async (formData: any) => {
    try {
      const response = await fetch("/api/builder-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert(`✅ Upload successful!\n\nFile: ${result.filename}\nProject: ${formData.projectId}\nUploaded at: ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Failed to upload:', error);
      alert('Upload failed. Please try again.');
    }
  };

  // Handle client upgrade requests
  const handleClientRequest = async (requestData: any) => {
    try {
      const response = await fetch("/api/client-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      alert(`✅ Upgrade request submitted!\n\nRequest ID: ${result.requestId}\nEstimated response: 2-3 business days`);
    } catch (error) {
      console.error('Failed to submit request:', error);
      alert('Request submission failed. Please try again.');
    }
  };

  // Chart data for financial overview
  const chartData = {
    labels: filteredProjects.map(p => p.name),
    datasets: [
      {
        label: "Loan Approved",
        data: filteredProjects.map(p => p.loanApproved),
        backgroundColor: "#10b981"
      },
      {
        label: "Total Investment",
        data: filteredProjects.map(p => p.landCost + p.buildCost),
        backgroundColor: "#f59e0b"
      },
      {
        label: "Projected Sale",
        data: filteredProjects.map(p => p.id === 1 ? 1080000 : 720000),
        backgroundColor: "#3b82f6"
      }
    ]
  };

  // Timeline data for progress tracking
  const timelineData = {
    labels: filteredProjects.map(p => p.name),
    datasets: [
      {
        label: "Progress %",
        data: filteredProjects.map(p => p.progressPercentage),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b px-3 py-2 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="text-lg sm:text-xl font-bold text-[#007144]">🏠 Lush Properties</div>
          <div className="hidden sm:flex items-center gap-2">
            {syncStatus === 'online' && <span className="text-xs text-green-600">🌐 Online</span>}
            {syncStatus === 'offline' && <span className="text-xs text-orange-600">📱 Offline</span>}
            {syncStatus === 'syncing' && <span className="text-xs text-blue-600">🔄 Syncing</span>}
          </div>
          {offlineQueue.length > 0 && (
            <span className="text-xs bg-orange-100 text-orange-800 px-1 py-0.5 rounded text-center min-w-[20px]">
              {offlineQueue.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Role:</label>
            <select
              className="border border-gray-300 px-2 py-1 rounded text-xs bg-white"
              value={localRole}
              onChange={(e) => setLocalRole(e.target.value)}
            >
              <option value="admin">👑 Admin</option>
              <option value="builder">🔨 Builder</option>
              <option value="client">🏠 Client</option>
              <option value="investor">💼 Investor</option>
            </select>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-medium text-gray-900">Hi {firstName}</div>
            <div className="text-xs text-gray-500">{localTime}</div>
            <div className="sm:hidden text-xs">
              {syncStatus === 'online' && <span className="text-green-600">🌐</span>}
              {syncStatus === 'offline' && <span className="text-orange-600">📱</span>}
              {syncStatus === 'syncing' && <span className="text-blue-600">🔄</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Helper */}
      {showNav && (
        <div className="sm:hidden bg-blue-50 border-b border-blue-200 p-2 text-center">
          <button 
            onClick={() => setShowNav(false)}
            className="text-xs text-blue-700 hover:text-blue-900"
          >
            📱 Tap to hide mobile helper • Optimized for touch
          </button>
        </div>
      )}

      {/* Smart Alerts Section - Dismissible */}
      {showSmartAlerts && (
        <div className="bg-white border-b p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              🔔 Smart Alerts
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSmartAlerts(false);
                console.log('[Smart Alerts] Dismissed by user');
              }}
              className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
            {alerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Workflow Insights - Dismissible */}
      {showAIInsights && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              🤖 AI Workflow Insights
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAIInsights(false);
                console.log('[AI Workflow Insights] Dismissed by user');
              }}
              className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="list-disc ml-4 text-sm text-gray-800 space-y-1">
            {aiInsights.map((insight, i) => (
              <li key={i} className="font-medium">{insight}</li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between items-center">
            <div className="text-xs text-purple-600 font-medium">
              All AI systems running ⚙️ — Lush Properties Pty Ltd powered by OpenAI
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = '/ai-workflows'}
              className="text-xs bg-purple-50 border-purple-200 hover:bg-purple-100"
            >
              <Brain className="h-3 w-3 mr-1" />
              View All
            </Button>
          </div>
        </div>
      )}

      <main className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            👋 Welcome, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {userRole === "client" ? "Track your property development" : "Real estate portfolio overview"} • {filteredProjects.length} Active Project{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Mobile-Optimized Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="flex items-center gap-1 text-xs sm:text-sm font-medium text-green-700">
                <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Total Loan</span>
                <span className="sm:hidden">Loan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-green-900">
                ${globalSummary.totalLoanApproved.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="flex items-center gap-1 text-xs sm:text-sm font-medium text-blue-700">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Projected Sales</span>
                <span className="sm:hidden">Sales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-blue-900">
                ${globalSummary.totalProjectedSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="flex items-center gap-1 text-xs sm:text-sm font-medium text-purple-700">
                <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Total Investment</span>
                <span className="sm:hidden">Investment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-purple-900">
                ${globalSummary.totalInvestment.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600 mt-1 hidden sm:block">Land + Build</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="flex items-center gap-1 text-xs sm:text-sm font-medium text-orange-700">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Claims Raised</span>
                <span className="sm:hidden">Claims</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-orange-900">
                ${globalSummary.totalClaimsRaised.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-1 sm:pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-yellow-700">
              <PiggyBank className="h-4 w-4" />
              Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              ${globalSummary.totalUserDeposit.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-indigo-700">
              <Target className="h-4 w-4" />
              Net Equity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              ${globalSummary.netEquity.toLocaleString()}
            </div>
            <div className="text-xs text-indigo-600 mt-1">Incl. Deposits</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Equity & Claims Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Project Equity & Claims Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={equityChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Progress Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendIcon className="h-5 w-5 text-green-600" />
              Project Progress Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={progressTimelineData} options={timelineOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Cards Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {editingProjectId === project.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="text-lg font-semibold"
                        placeholder="Project name"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(project.id);
                          if (e.key === 'Escape') handleCancel();
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSave(project.id)}
                        className="h-8 px-2 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-8 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-lg flex-1">{project.name}</CardTitle>
                      {userRole === "admin" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(project.id, project.name, project.userDeposit)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <a
                  href={createGoogleMapsUrl(project.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 w-fit"
                >
                  {project.address}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Lender</div>
                    <div className="text-gray-900">{project.lender}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Current Stage</div>
                    <div className="text-gray-900">{project.stage}</div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Loan Approved</div>
                    <div className="text-green-600 font-semibold">
                      ${project.loanApproved.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">User Deposit</div>
                    {editingProjectId === project.id && userRole === "admin" ? (
                      <Input
                        type="number"
                        value={editingDeposit}
                        onChange={(e) => setEditingDeposit(Number(e.target.value))}
                        className="h-8 text-sm w-full"
                        placeholder="Deposit amount"
                      />
                    ) : (
                      <div className="text-yellow-600 font-semibold">
                        ${project.userDeposit.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Land + Build</div>
                    <div className="text-blue-600 font-semibold">
                      ${(project.landCost + project.buildCost).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Claims Raised</div>
                    <div className="text-orange-600 font-semibold">
                      ${project.claimsRaised.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Project Net Equity */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Project Net Equity</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ${((1800000 * (project.id === 1 ? 0.6 : 0.4)) - project.loanApproved + project.userDeposit).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Projected sale value + deposit - loan
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Progress</span>
                    <span>{project.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Documents and Next Action */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Documents</div>
                    <div className="flex items-center gap-1 text-gray-900">
                      <FileText className="h-4 w-4" />
                      {project.documentsCount} files
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Next Action</div>
                    <div className="text-gray-900">{project.nextAction}</div>
                  </div>
                </div>

                {/* AI Insight Section */}
                {(aiTips[project.id] || loadingTips[project.id]) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800 flex-1">
                        <strong>AI Insight:</strong>{" "}
                        {loadingTips[project.id] ? (
                          <span className="text-gray-600">Analyzing project financials...</span>
                        ) : (
                          <span className="whitespace-pre-wrap">{aiTips[project.id]}</span>
                        )}
                      </div>
                      {aiTips[project.id] && !loadingTips[project.id] && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => fetchAIInsight(project, true)}
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                          title="Refresh AI analysis"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Mobile-Optimized Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 min-w-0">
                    <Upload className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Upload</span>
                    <span className="sm:hidden">📤</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMapClick(project)}
                    className="flex-1 min-w-0 text-blue-600 hover:text-blue-700"
                  >
                    <span className="mr-1">📍</span>
                    <span className="hidden sm:inline">View Map</span>
                    <span className="sm:hidden">Map</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchAIInsight(project, true)}
                    disabled={loadingTips[project.id]}
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200 flex-1 min-w-0"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{loadingTips[project.id] ? "..." : "Refresh AI"}</span>
                    <span className="sm:hidden">🤖</span>
                  </Button>
                </div>

                {/* Mobile-Optimized Role-Based Action Buttons */}
                {userRole !== "accountant" && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    {(userRole === "admin" || userRole === "broker") && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 min-w-0"
                          onClick={() => {
                            handleRaiseClaim(project);
                            notifyUser("💰 Claim Processing", "Your claim is being submitted");
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Raise Claim</span>
                          <span className="sm:hidden">💰</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1 bg-rose-600 hover:bg-rose-700 min-w-0"
                          onClick={() => {
                            sendAIReminder(project);
                            notifyUser("📧 Reminder Sent", "AI reminder email has been generated");
                          }}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">AI Reminder</span>
                          <span className="sm:hidden">📧</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700 min-w-0"
                          onClick={() => {
                            sendAINextStep(project);
                            notifyUser("💡 Next Step Generated", "AI has provided next step recommendations");
                          }}
                        >
                          <Lightbulb className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Next Step</span>
                          <span className="sm:hidden">💡</span>
                        </Button>
                      </>
                    )}
                    
                    {userRole === "solicitor" && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          Legal Review
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Building className="h-4 w-4 mr-1" />
                          Compliance
                        </Button>
                      </>
                    )}

                    {userRole === "builder" && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload Progress
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          Submit Report
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Export Button for Investors and Admins */}
                {(userRole === "admin" || userRole === "investor") && (
                  <div className="pt-3 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                      onClick={() => handleExportProject(project.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      📤 Export Project Pack
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Receipt Upload Section - Hidden for clients */}
      {userRole !== "client" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              📷 Mobile Receipt Upload & Xero Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                capture="environment"
                accept="image/*,application/pdf"
                onChange={handleReceiptUpload}
                disabled={uploading}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                disabled={uploading}
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                {uploading ? "Uploading..." : "📤 Upload Receipt"}
              </Button>
            </div>
            {uploading && (
              <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Processing receipt and syncing with Xero...
              </div>
            )}
            <div className="mt-3 text-sm text-gray-600">
              📱 Mobile camera supported. Automatically extracts amount, vendor, and project details from JPG, PNG, PDF.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receipt Management Section - Hidden for clients */}
      {userRole !== "client" && receipts.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Receipt Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Project</th>
                    <th className="text-left py-2 px-3">Description</th>
                    <th className="text-left py-2 px-3">Amount</th>
                    <th className="text-left py-2 px-3">Category</th>
                    <th className="text-left py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt: any) => (
                    <tr key={receipt.id} className="border-b">
                      <td className="py-2 px-3">{receipt.project}</td>
                      <td className="py-2 px-3">
                        <Input
                          defaultValue={receipt.description}
                          onBlur={(e) => updateSpend(receipt.id, "description", e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          defaultValue={receipt.amount}
                          onBlur={(e) => updateSpend(receipt.id, "amount", e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          defaultValue={receipt.category}
                          onBlur={(e) => updateSpend(receipt.id, "category", e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Button variant="outline" size="sm" asChild>
                          <a href={receipt.link || '#'} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investor Funding Portal */}
      {userRole === "investor" && (
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <DollarSign className="h-5 w-5" />
              💼 Submit Funding Proposal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  projectName: formData.get('name') as string,
                  budget: parseInt(formData.get('budget') as string),
                  location: formData.get('location') as string,
                  description: formData.get('description') as string
                };
                handleAIProposalReview(data);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" placeholder="Project Name" required />
                <Input name="budget" type="number" placeholder="Budget ($)" required />
                <Input name="location" placeholder="Location" required />
                <textarea 
                  name="description" 
                  placeholder="Project Description" 
                  className="border rounded-md p-2 col-span-2"
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                🧠 Check AI Fundability Score
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admin Builder Onboarding */}
      {userRole === "admin" && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Building className="h-5 w-5" />
              📦 Onboard Builder or Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  name: formData.get('fullname') as string,
                  email: formData.get('email') as string,
                  role: formData.get('role') as string,
                  company: formData.get('company') as string
                };
                handleUserInvite(data);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="fullname" placeholder="Full Name" required />
                <Input name="email" type="email" placeholder="Email Address" required />
                <Input name="company" placeholder="Company Name" />
                <select name="role" className="border rounded-md p-2" required>
                  <option value="">Select Role</option>
                  <option value="builder">Builder</option>
                  <option value="agent">Real Estate Agent</option>
                  <option value="client">Client</option>
                  <option value="accountant">Accountant</option>
                  <option value="solicitor">Solicitor</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                📧 Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Scheduling & Calendar Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            📅 Scheduled Milestones & Inspections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-3 text-center">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - 6);
                    const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                    const hasEvent = events.some((e: any) => 
                      new Date(e.date).toDateString() === date.toDateString()
                    );
                    return (
                      <button
                        key={i}
                        onClick={() => handleCalendarClick(date)}
                        className={`p-2 rounded ${
                          isCurrentMonth 
                            ? hasEvent 
                              ? 'bg-blue-100 text-blue-800 font-bold' 
                              : 'bg-white hover:bg-gray-100'
                            : 'text-gray-300'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Tap on any date to view scheduled events and inspections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Upcoming Events</h4>
              <div className="space-y-3">
                {events.slice(0, 5).map((event: any) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{event.title}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{event.project}</p>
                      <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-gray-500 text-sm">No upcoming events scheduled.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Builder Breakdown Chart */}
      {receipts.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              📊 Spend Breakdown Per Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-md mx-auto">
              <Pie data={builderBreakdown()} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendIcon className="h-5 w-5 text-green-600" />
              Progress Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line 
              data={timelineData} 
              options={{ 
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value: any) {
                        return value + '%';
                      }
                    }
                  }
                }
              }} 
            />
          </CardContent>
        </Card>
      </div>

        {/* Mobile-Optimized Footer */}
        <footer className="mt-8 bg-white rounded-lg p-4 text-center border-t">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-gray-600">
              📱 Mobile PWA • 🔔 Push Notifications • 🌐 Offline Ready
            </p>
            <p className="text-xs text-gray-500">
              Built with Lush Properties Control Center • {new Date().getFullYear()}
            </p>
            {userRole === "investor" && (
              <p className="text-xs text-purple-600 font-medium">
                💼 Investor Portal Active
              </p>
            )}
            <p className="text-xs text-blue-600">
              Add to Home Screen for best mobile experience
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LushDashboard;