import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, DollarSign, Building, TrendingUp, PiggyBank, Target, Edit2, ExternalLink } from "lucide-react";

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

  // Calculate global summary from projects including deposits
  const globalSummary = {
    totalLoanApproved: projects.reduce((sum, p) => sum + p.loanApproved, 0),
    totalProjectedSales: 1800000, // Based on market projections
    totalInvestment: projects.reduce((sum, p) => sum + p.landCost + p.buildCost, 0),
    totalUserDeposit: projects.reduce((sum, p) => sum + p.userDeposit, 0),
    totalClaimsRaised: projects.reduce((sum, p) => sum + p.claimsRaised, 0),
    netEquity: 1800000 - projects.reduce((sum, p) => sum + p.loanApproved, 0) + projects.reduce((sum, p) => sum + p.userDeposit, 0)
  };

  const handleNameEdit = (projectId: number, currentName: string) => {
    setEditingProjectId(projectId);
    setEditingName(currentName);
  };

  const handleNameSave = (projectId: number) => {
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId ? { ...p, name: editingName } : p
      )
    );
    setEditingProjectId(null);
    setEditingName("");
  };

  const handleNameCancel = () => {
    setEditingProjectId(null);
    setEditingName("");
  };

  const createGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNameSave(project.id);
                          if (e.key === 'Escape') handleNameCancel();
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleNameSave(project.id)}
                        className="h-8 px-2"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleNameCancel}
                        className="h-8 px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-lg flex-1">{project.name}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleNameEdit(project.id, project.name)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
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
                    <div className="text-yellow-600 font-semibold">
                      ${project.userDeposit.toLocaleString()}
                    </div>
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
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Raise Claim
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