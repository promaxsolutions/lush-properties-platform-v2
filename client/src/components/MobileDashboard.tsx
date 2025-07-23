import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PiggyBank, TrendingUp, Building, DollarSign, Camera, FileText, MapPin, Upload, Target, Edit2, ExternalLink, Lightbulb, Save, X, RefreshCw, BarChart3, Mail, Bell, Calendar as CalendarIcon, Clock, AlertCircle, Brain } from 'lucide-react';
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

const MobileDashboard = () => {
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [showNav, setShowNav] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [localRole, setLocalRole] = useState<string>("admin");
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDeposit, setEditingDeposit] = useState(0);
  const [aiTips, setAiTips] = useState<Record<number, string>>({});
  const [loadingTips, setLoadingTips] = useState<Record<number, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  
  const firstName = "Alex";
  const localTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    fetchProjects();
    fetchAuditTrail();
    setupPushNotifications();
    logAuditAction("Dashboard accessed", `User viewed mobile dashboard as ${localRole}`);
  }, [localRole]);

  const fetchProjects = async () => {
    try {
      const mockProjects = [
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

      let filteredProjects = mockProjects;
      if (localRole === "builder") {
        filteredProjects = mockProjects.filter(p => p.builderEmail === "builder@example.com");
      } else if (localRole === "client") {
        filteredProjects = mockProjects.filter(p => p.clientEmail === "client@example.com");
      } else if (localRole === "investor") {
        filteredProjects = mockProjects.filter(p => p.investorEmails?.includes("investor@example.com"));
      }
      
      setProjects(filteredProjects);
      logAuditAction("Projects fetched", `Loaded ${filteredProjects.length} projects for ${localRole} role`);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchAuditTrail = async () => {
    const mockAuditTrail = [
      { timestamp: "16:45", user: firstName, action: "Viewed project details" },
      { timestamp: "16:44", user: "AI Assistant", action: "Generated analysis" },
      { timestamp: "16:43", user: firstName, action: "Camera accessed" },
      { timestamp: "16:42", user: "System", action: "Sync status updated" }
    ];
    setAuditTrail(mockAuditTrail);
  };

  const setupPushNotifications = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const logAuditAction = (action: string, details: string) => {
    const newEntry = {
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      user: firstName,
      action: `${action}: ${details}`
    };
    setAuditTrail(prev => [newEntry, ...prev.slice(0, 9)]);
  };

  const notifyUser = (title: string, message: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
  };

  const handleCameraCapture = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }
        });
        setCameraEnabled(true);
        logAuditAction("Camera activated", "Mobile camera accessed for receipt capture");
        
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          setCameraEnabled(false);
          setCapturedImage("captured");
          notifyUser("Photo Captured", "Receipt ready for processing");
          logAuditAction("Photo captured", "Receipt image captured successfully");
        }, 3000);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      notifyUser("Camera Error", "Unable to access camera");
      logAuditAction("Camera error", "Failed to access mobile camera");
    }
  };

  const handleMapClick = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
    notifyUser("Opening Maps", `Opening location in Google Maps`);
    logAuditAction("Map accessed", `Opened Google Maps for ${address}`);
  };

  // Calculate comprehensive financial summary
  const globalSummary = {
    totalLoanApproved: projects.reduce((sum, p) => sum + (p.loanApproved || 0), 0),
    totalProjectedSales: projects.reduce((sum, p) => sum + (p.loanApproved || 0) + (p.userDeposit || 0), 0),
    totalInvestment: projects.reduce((sum, p) => sum + (p.landCost || 0) + (p.buildCost || 0), 0),
    totalClaimsRaised: projects.reduce((sum, p) => sum + (p.claimsRaised || 0), 0),
    totalUserDeposit: projects.reduce((sum, p) => sum + (p.userDeposit || 0), 0),
    get netEquity() { 
      return this.totalProjectedSales - this.totalInvestment; 
    }
  };

  // AI functionality
  const generateAiTip = async (projectId: number, project: any) => {
    setLoadingTips(prev => ({ ...prev, [projectId]: true }));
    
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze this property project: ${project.name}, ${project.address}, Stage: ${project.stage}, Progress: ${project.progressPercentage}%, Loan: $${project.loanApproved}. Provide a brief profit tip.`,
          context: 'profit-analysis'
        })
      });
      
      const data = await response.json();
      setAiTips(prev => ({ ...prev, [projectId]: data.reply || "AI analysis complete" }));
    } catch (error) {
      setAiTips(prev => ({ ...prev, [projectId]: "Analysis temporarily unavailable" }));
    } finally {
      setLoadingTips(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProjectId(project.id);
    setEditingName(project.name);
    setEditingDeposit(project.userDeposit);
  };

  const saveProject = () => {
    if (editingProjectId) {
      setProjects(prev => prev.map(p => 
        p.id === editingProjectId 
          ? { ...p, name: editingName, userDeposit: editingDeposit }
          : p
      ));
      setEditingProjectId(null);
      logAuditAction("Project updated", `Updated ${editingName} deposit to $${editingDeposit.toLocaleString()}`);
    }
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
    setEditingName("");
    setEditingDeposit(0);
  };

  const raiseClaim = async (project: any) => {
    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          amount: Math.min(100000, project.loanApproved - project.claimsRaised),
          description: `Progress claim for ${project.stage}`,
          lender: project.lender
        })
      });
      
      if (response.ok) {
        notifyUser("Claim Submitted", `Progress claim raised for ${project.name}`);
        logAuditAction("Claim raised", `Submitted progress claim for ${project.name}`);
      }
    } catch (error) {
      console.error('Failed to raise claim:', error);
    }
  };

  // Chart data for mobile visualization  
  const equityChartData = {
    labels: projects.map(p => {
      // Shorten labels for mobile display
      const name = p.name.split(',')[0];
      return name.length > 12 ? name.substring(0, 12) + '...' : name;
    }),
    datasets: [{
      label: 'Net Equity',
      data: projects.map(p => (p.loanApproved + p.userDeposit) - (p.landCost + p.buildCost)),
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 1.5,
      borderRadius: 3
    }]
  };

  const progressChartData = {
    labels: projects.map(p => {
      // Shorten labels for mobile display
      const name = p.name.split(',')[0];
      return name.length > 12 ? name.substring(0, 12) + '...' : name;
    }),
    datasets: [{
      label: 'Progress %',
      data: projects.map(p => p.progressPercentage),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1.5,
      tension: 0.3,
      fill: false
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          maxTicksLimit: 4
        }
      },
      x: { 
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          maxRotation: 0,
          minRotation: 0
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4
      }
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      }
    },
    barPercentage: 0.6,
    categoryPercentage: 0.8
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b px-3 py-2 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-green-600">🏠 Lush Properties</div>
            {syncStatus === 'online' && <span className="text-xs text-green-600">🌐</span>}
            {syncStatus === 'offline' && <span className="text-xs text-orange-600">📱</span>}
            {syncStatus === 'syncing' && <span className="text-xs text-blue-600">🔄</span>}
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-gray-900">Hi {firstName}</div>
            <div className="text-xs text-gray-500">{localTime}</div>
          </div>
        </div>
        

      </header>



      <main className="p-3 space-y-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h1 className="text-lg font-bold text-gray-900">👋 Welcome, {firstName}</h1>
          <p className="text-xs text-gray-600 mt-1">
            {localRole === "admin" ? "Full system access" : 
             localRole === "builder" ? "Builder project view" :
             localRole === "client" ? "Your development progress" :
             "Investment portfolio overview"} • {projects.length} Active Project{projects.length !== 1 ? 's' : ''}
          </p>

        </div>

        {/* Mobile-Optimized Summary Cards */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1 text-xs font-medium text-green-700">
                <PiggyBank className="h-3 w-3" />
                <span>Loan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-bold text-green-900">
                ${Math.round(globalSummary.totalLoanApproved / 1000)}K
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1 text-xs font-medium text-blue-700">
                <TrendingUp className="h-3 w-3" />
                <span>Sales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-bold text-blue-900">
                ${Math.round(globalSummary.totalProjectedSales / 1000)}K
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1 text-xs font-medium text-purple-700">
                <DollarSign className="h-3 w-3" />
                <span>Net Equity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-bold text-purple-900">
                ${Math.round(globalSummary.netEquity / 1000)}K
              </div>
              <div className="text-xs text-purple-600">
                Total profit margin
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1 text-xs font-medium text-orange-700">
                <Target className="h-3 w-3" />
                <span>Claims Raised</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-bold text-orange-900">
                ${Math.round(globalSummary.totalClaimsRaised / 1000)}K
              </div>
              <div className="text-xs text-orange-600">
                Progress payments
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Charts Section */}
        <div className="space-y-3 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                Equity Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="h-20 sm:h-24">
                <Bar data={equityChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Project Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="h-20 sm:h-24">
                <Line data={progressChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {aiInsights.slice(0, 3).map((insight, index) => (
                <div key={index} className="text-xs p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded border-l-2 border-green-400">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{insight}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Project Management Cards */}
        <div className="space-y-3">
          {projects.map((project) => (
            <Card key={project.id} className="shadow-sm border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  {editingProjectId === project.id ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="text-sm"
                        placeholder="Project name"
                      />
                      <Input
                        type="number"
                        value={editingDeposit}
                        onChange={(e) => setEditingDeposit(Number(e.target.value))}
                        className="text-sm"
                        placeholder="Deposit amount"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveProject} size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button onClick={cancelEdit} size="sm" variant="outline" className="text-xs">
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        {project.name}
                        {localRole === 'admin' && (
                          <Button
                            onClick={() => handleEditProject(project)}
                            size="sm"
                            variant="ghost"
                            className="p-1 h-auto"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                      </CardTitle>
                      <p className="text-xs text-gray-600 mt-1">
                        {project.stage} • {project.progressPercentage}% complete
                      </p>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                {/* Project Financial Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">Loan Approved</div>
                    <div className="font-semibold text-green-700">
                      ${(project.loanApproved / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">User Deposit</div>
                    <div className="font-semibold text-blue-700">
                      ${(project.userDeposit / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">Claims Raised</div>
                    <div className="font-semibold text-orange-700">
                      ${(project.claimsRaised / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">Net Equity</div>
                    <div className="font-semibold text-purple-700">
                      ${(((project.loanApproved + project.userDeposit) - (project.landCost + project.buildCost)) / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Address with Map Link */}
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <button 
                    onClick={() => handleMapClick(project.address)}
                    className="text-blue-600 hover:text-blue-800 underline flex-1 text-left"
                  >
                    {project.address}
                  </button>
                </div>

                {/* Next Action */}
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <div className="text-blue-800 font-medium">Next Action:</div>
                  <div className="text-blue-700">{project.nextAction}</div>
                </div>

                {/* AI Tip Section */}
                <div className="border-t pt-2">
                  {aiTips[project.id] ? (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-2 rounded border-l-2 border-green-400">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-gray-700">{aiTips[project.id]}</div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => generateAiTip(project.id, project)}
                      disabled={loadingTips[project.id]}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-8"
                    >
                      {loadingTips[project.id] ? (
                        <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Brain className="h-3 w-3 mr-1" />
                      )}
                      {loadingTips[project.id] ? 'Analyzing...' : 'Get AI Tip'}
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => raiseClaim(project)}
                    size="sm"
                    className="flex-1 text-xs bg-[#007144] hover:bg-[#00a060]"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Raise Claim
                  </Button>
                  
                  <Button
                    onClick={handleCameraCapture}
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    disabled={cameraEnabled}
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    {cameraEnabled ? 'Recording...' : 'Photo'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Audit Trail */}
        {localRole === 'admin' && (
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="max-h-32 overflow-y-auto space-y-1">
                {auditTrail.slice(0, 5).map((entry, index) => (
                  <div key={index} className="text-xs border-b border-gray-100 pb-1">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{entry.action}</span>
                      <span className="text-gray-500">{entry.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MobileDashboard;