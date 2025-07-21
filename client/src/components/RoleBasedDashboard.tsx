import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, 
  Upload, 
  FileText, 
  BarChart3, 
  Home, 
  RefreshCw, 
  CreditCard, 
  TrendingUp, 
  Download, 
  PlusCircle,
  Brain,
  Building2,
  Users,
  DollarSign
} from "lucide-react";

const RoleBasedDashboard = () => {
  const [role, setRole] = useState("admin");
  const firstName = "Alex";
  const [aiInsightsExpanded, setAiInsightsExpanded] = useState(false);

  const aiInsights = [
    "💸 Best lender: ORDE (saves $22K)",
    "📈 Fundability: 8.7/10 – investor ready", 
    "🧱 Builder MacHomes rated 4.7★",
    "🚨 Roofing quote 12% above market average",
    "📅 Plumbing final due this week"
  ];

  const renderAdminView = () => (
    <div className="space-y-6">
      {/* AI Workflow Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-purple-600" />
            🤖 AI Workflow Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <details 
            className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-4 rounded-lg"
            open={aiInsightsExpanded}
            onToggle={(e) => setAiInsightsExpanded((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer text-sm font-medium text-purple-800 mb-2">
              View AI suggestions ({aiInsights.length} active)
            </summary>
            <ul className="list-disc ml-5 text-sm mt-3 space-y-1 text-gray-700">
              {aiInsights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-purple-200">
              <Button size="sm" variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                Open AI Workflow Engine
              </Button>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Admin Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-medium">📁 All Projects</h3>
            <p className="text-sm text-gray-600 mt-1">Manage portfolio</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-medium">📤 Claims Center</h3>
            <p className="text-sm text-gray-600 mt-1">Process claims</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-medium">📄 Contracts</h3>
            <p className="text-sm text-gray-600 mt-1">Upload & parse</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-medium">📊 Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">Financial charts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBuilderView = () => (
    <div className="space-y-6">
      {/* Builder Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-blue-600">Active Projects</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">3</p>
              </div>
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">On Schedule</p>
                <p className="text-2xl font-bold text-green-900">2</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Pending Claims</p>
                <p className="text-2xl font-bold text-orange-900">1</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Builder Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Building2 className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-medium">🧱 My Projects</h3>
            <p className="text-sm text-gray-600 mt-1">View assignments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-medium">📸 Upload Progress</h3>
            <p className="text-sm text-gray-600 mt-1">Photos & receipts</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-medium">🔔 Timeline</h3>
            <p className="text-sm text-gray-600 mt-1">Tasks & reminders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderClientView = () => (
    <div className="space-y-6">
      {/* Client Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Your Build Progress</h3>
              <p className="text-sm text-blue-700">Stage 7 - Fitout (78% complete)</p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
            <Home className="h-12 w-12 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Client Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Home className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-medium">🏠 Build Progress</h3>
            <p className="text-sm text-gray-600 mt-1">Track your home</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-medium">🔁 Upgrade Requests</h3>
            <p className="text-sm text-gray-600 mt-1">Submit changes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-medium">💳 Loan Timeline</h3>
            <p className="text-sm text-gray-600 mt-1">Drawdown schedule</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInvestorView = () => (
    <div className="space-y-6">
      {/* Investment Opportunities */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">Investment Overview</h3>
              <p className="text-sm text-green-700">2 opportunities available • Average ROI: 12.4%</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Investor Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-medium">📈 Fundability</h3>
            <p className="text-sm text-gray-600 mt-1">Project scores</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Download className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-medium">📥 Investment Pack</h3>
            <p className="text-sm text-gray-600 mt-1">Download reports</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <PlusCircle className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-medium">💼 Fund Proposal</h3>
            <p className="text-sm text-gray-600 mt-1">Submit funding</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRoleView = () => {
    switch (role) {
      case "admin": return renderAdminView();
      case "builder": return renderBuilderView();
      case "client": return renderClientView();
      case "investor": return renderInvestorView();
      default: return (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-3 text-red-500" />
            <p className="text-red-500 font-medium">Unknown role: {role}</p>
            <p className="text-sm text-gray-600 mt-1">Please select a valid role</p>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {firstName}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Role: <span className="capitalize font-medium text-blue-600">{role}</span>
            </p>
          </div>
          
          {/* Role Switcher */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Switch Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">👑 Admin</option>
              <option value="builder">🔨 Builder</option>
              <option value="client">🏠 Client</option>
              <option value="investor">💼 Investor</option>
            </select>
          </div>
        </div>
      </header>

      {/* Role-Specific Content */}
      <main className="p-6">
        {renderRoleView()}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Lush Properties Pty Ltd — Dashboard view optimized for {role} role
          </p>
          <div className="flex justify-center items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RoleBasedDashboard;