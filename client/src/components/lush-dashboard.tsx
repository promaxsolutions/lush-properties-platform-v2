import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, DollarSign, Building, TrendingUp, PiggyBank, Target, Edit2, ExternalLink, Lightbulb, Save, X, RefreshCw, BarChart3, TrendingUp as TrendIcon } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
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
  Legend
);

// Mock project data with deposits
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
    claimsRaised: 935000
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
    claimsRaised: 200000
  }
];

const LushDashboard = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDeposit, setEditingDeposit] = useState(0);
  const [aiTips, setAiTips] = useState<Record<number, string>>({});
  const [loadingTips, setLoadingTips] = useState<Record<number, boolean>>({});
  
  // Mock user role - in real app this would come from auth context
  const userRole = "admin"; // Could be "admin", "broker", "solicitor"

  // Calculate global summary from projects including deposits
  const globalSummary = {
    totalLoanApproved: projects.reduce((sum, p) => sum + p.loanApproved, 0),
    totalProjectedSales: 1800000, // Based on market projections
    totalInvestment: projects.reduce((sum, p) => sum + p.landCost + p.buildCost, 0),
    totalUserDeposit: projects.reduce((sum, p) => sum + p.userDeposit, 0),
    totalClaimsRaised: projects.reduce((sum, p) => sum + p.claimsRaised, 0),
    netEquity: 1800000 - projects.reduce((sum, p) => sum + p.loanApproved, 0) + projects.reduce((sum, p) => sum + p.userDeposit, 0)
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
    // In real implementation, this would navigate to claims page or open modal
    // For now, simulate claim creation
    try {
      const claimData = {
        projectId: project.id,
        projectName: project.name,
        stage: project.stage,
        amount: Math.round(project.loanApproved * 0.15), // 15% of loan for this stage
        lender: project.lender,
        progress: project.progressPercentage
      };

      // Mock API call - in real app this would create the claim
      console.log('Creating claim:', claimData);
      
      // Show success feedback (could be replaced with toast notification)
      alert(`Progress claim initiated for ${project.name}\nStage: ${project.stage}\nAmount: $${claimData.amount.toLocaleString()}`);
      
    } catch (error) {
      console.error('Failed to create claim:', error);
      alert('Failed to create progress claim. Please try again.');
    }
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Lush Properties Dashboard</h1>
        <div className="text-sm text-gray-500">
          {projects.length} Active Projects
        </div>
      </div>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-700">
              <PiggyBank className="h-4 w-4" />
              Total Loan Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ${globalSummary.totalLoanApproved.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <TrendingUp className="h-4 w-4" />
              Projected Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              ${globalSummary.totalProjectedSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-700">
              <Building className="h-4 w-4" />
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ${globalSummary.totalInvestment.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600 mt-1">Land + Build</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-700">
              <DollarSign className="h-4 w-4" />
              Claims Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              ${globalSummary.totalClaimsRaised.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-2">
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

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-1" />
                    View Docs
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleRaiseClaim(project)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Raise Claim
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchAIInsight(project, true)}
                    disabled={loadingTips[project.id]}
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    {loadingTips[project.id] ? "..." : "Refresh AI"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LushDashboard;