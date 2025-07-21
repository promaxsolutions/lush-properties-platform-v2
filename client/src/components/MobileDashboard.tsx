import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingUp, Building, DollarSign, Camera, FileText, MapPin } from 'lucide-react';

const MobileDashboard = () => {
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [showNav, setShowNav] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [localRole, setLocalRole] = useState<string>("admin");
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
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
          address: "56 Inge King Crescent, Bonner ACT 2914",
          stage: "Framing",
          progressPercentage: 45,
          builderEmail: "builder@example.com",
          clientEmail: "client@example.com",
          investorEmails: ["investor@example.com"]
        },
        {
          id: 2,
          name: "Block 15 Section 87",
          address: "Block 15 Section 87, Whitlam ACT 2611",
          stage: "Slab",
          progressPercentage: 25,
          builderEmail: "builder@example.com",
          clientEmail: "client2@example.com",
          investorEmails: ["investor@example.com"]
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

  // Mock data
  const globalSummary = {
    totalLoanApproved: 1500000,
    totalProjectedSales: 1800000,
    totalInvestment: 1200000,
    totalClaimsRaised: 450000,
    totalUserDeposit: 230000,
    netEquity: 580000
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b px-3 py-2 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-blue-600">🏠 Lush OS</div>
            {syncStatus === 'online' && <span className="text-xs text-green-600">🌐</span>}
            {syncStatus === 'offline' && <span className="text-xs text-orange-600">📱</span>}
            {syncStatus === 'syncing' && <span className="text-xs text-blue-600">🔄</span>}
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-gray-900">Hi {firstName}</div>
            <div className="text-xs text-gray-500">{localTime}</div>
          </div>
        </div>
        
        {/* Role Switcher for Testing */}
        <div className="mt-2 flex items-center justify-center">
          <select
            className="border px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
            value={localRole}
            onChange={(e) => {
              setLocalRole(e.target.value);
              logAuditAction("Role switched", `Changed to ${e.target.value} role for testing`);
            }}
          >
            <option value="admin">👑 Admin</option>
            <option value="builder">🔨 Builder</option>
            <option value="client">🏠 Client</option>
            <option value="investor">💼 Investor</option>
          </select>
        </div>
      </header>

      {/* Mobile Navigation Helper */}
      {showNav && (
        <div className="sm:hidden bg-blue-50 border-b border-blue-200 p-2 text-center">
          <button 
            onClick={() => setShowNav(false)}
            className="text-xs text-blue-700"
          >
            📱 Optimized for mobile • Tap to hide
          </button>
        </div>
      )}

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
          <div className="text-xs text-blue-600 mt-1">
            Currently viewing as: <span className="font-bold">{localRole.toUpperCase()}</span>
          </div>
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
                <Building className="h-3 w-3" />
                <span>Investment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-bold text-purple-900">
                ${Math.round(globalSummary.totalInvestment / 1000)}K
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1 text-xs font-medium text-orange-700">
                <DollarSign className="h-3 w-3" />
                <span>Claims</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-bold text-orange-900">
                ${Math.round(globalSummary.totalClaimsRaised / 1000)}K
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Camera Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 text-sm">
              <Camera className="h-4 w-4" />
              📷 Mobile Receipt Capture
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!cameraEnabled && !capturedImage && (
              <Button 
                onClick={handleCameraCapture}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
              >
                📱 Take Receipt Photo
              </Button>
            )}
            
            {cameraEnabled && (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <Camera className="h-8 w-8 mx-auto text-purple-600 mb-2 animate-pulse" />
                <p className="text-sm font-medium">Camera Active</p>
                <p className="text-xs text-gray-600">Position receipt in frame</p>
              </div>
            )}
            
            {capturedImage && (
              <div className="space-y-2">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 font-medium text-sm">📸 Photo Captured</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-xs">
                    🔍 Process
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 text-xs"
                  >
                    🔄 Retake
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">🏗️ Projects Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-gray-900 truncate flex-1">
                    {project.name}
                  </h4>
                  <button 
                    onClick={() => handleMapClick(project.address)}
                    className="text-blue-600 ml-2"
                  >
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2">Stage: {project.stage}</p>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div 
                    className="h-2 rounded bg-blue-500" 
                    style={{ width: `${project.progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.progressPercentage}% Complete</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              📝 Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
              {auditTrail.map((log, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded border-l-2 border-blue-200">
                  <span className="text-gray-500">{log.timestamp}</span> • 
                  <span className="font-medium text-blue-600 mx-1">{log.user}</span> • 
                  <span className="text-gray-700">{log.action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Footer */}
        <footer className="bg-white rounded-lg p-3 text-center text-xs text-gray-500 space-y-1">
          <p>📱 Add to Home Screen for best experience</p>
          <div className="flex justify-center items-center gap-2">
            <span>Built by Lush Properties Pty Ltd • 2025</span>
            <span>•</span>
            <span className="text-blue-600">Mobile Ready</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MobileDashboard;