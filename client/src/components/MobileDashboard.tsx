import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingUp, Building, DollarSign, Camera, FileText, Calendar, MapPin } from 'lucide-react';

const MobileDashboard = () => {
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [showNav, setShowNav] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const firstName = "Alex";
  const userRole = "admin";
  const localTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Mobile camera functionality
  const handleCameraCapture = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }
        });
        setCameraEnabled(true);
        
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          setCameraEnabled(false);
          setCapturedImage("captured");
          notifyUser("✅ Photo Captured", "Receipt ready for processing");
        }, 3000);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      notifyUser("❌ Camera Error", "Unable to access camera");
    }
  };

  const notifyUser = (title: string, message: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
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

  const projects = [
    {
      id: 1,
      name: "56 Inge King Crescent",
      address: "56 Inge King Crescent, Bonner ACT 2914",
      stage: "Framing",
      progressPercentage: 45
    },
    {
      id: 2,
      name: "Block 15 Section 87",
      address: "Block 15 Section 87, Whitlam ACT 2611",
      stage: "Slab",
      progressPercentage: 25
    }
  ];

  const handleMapClick = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
    notifyUser("📍 Opening Maps", `Opening location in Google Maps`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b px-3 py-2 flex justify-between items-center sticky top-0 z-10">
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
            Real estate portfolio overview • {projects.length} Active Projects
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
                ${(globalSummary.totalLoanApproved / 1000)}K
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
                ${(globalSummary.totalProjectedSales / 1000)}K
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
                ${(globalSummary.totalInvestment / 1000)}K
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
                ${(globalSummary.totalClaimsRaised / 1000)}K
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
            <div className="space-y-2 text-xs">
              {[
                "16:45 - Viewed project details",
                "16:44 - AI analysis generated", 
                "16:43 - Camera accessed",
                "16:42 - Sync status updated"
              ].map((log, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded border-l-2 border-blue-200">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Footer */}
        <footer className="bg-white rounded-lg p-3 text-center text-xs text-gray-500 space-y-1">
          <p>📱 Add to Home Screen for best experience</p>
          <div className="flex justify-center items-center gap-2">
            <span>Built for Lush Group • 2024</span>
            <span>•</span>
            <span className="text-blue-600">Mobile Ready</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MobileDashboard;