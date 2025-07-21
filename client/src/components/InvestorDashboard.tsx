import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp,
  FileText,
  DollarSign,
  BarChart,
  Download,
  Upload,
  Eye,
  Calendar,
  MapPin,
  Building,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Banknote,
  Clock,
  Camera,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Activity,
  Zap
} from 'lucide-react';

const InvestorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock investor data
  const investorStats = {
    totalInvested: 2400000,
    activeProjects: 5,
    avgROI: 18.5,
    totalReturns: 445000
  };

  const assignedProjects = [
    {
      id: 1,
      name: "Luxury Townhouse Development",
      address: "56 Inge King Crescent, Scullin ACT 2614",
      status: "In Progress",
      stage: "Framing",
      progress: 65,
      investedAmount: 850000,
      currentValuation: 1020000,
      expectedROI: 22.5,
      completionDate: "September 2025",
      riskLevel: "Low",
      timeline: ["Planning", "Foundation", "Framing", "Roofing", "Lockup", "Handover"],
      currentStageIndex: 2,
      lastUpdate: "2025-01-20",
      builderPhotos: [
        { id: 1, url: "/api/placeholder/400/300", caption: "Framing progress - Living area", date: "2025-01-18" },
        { id: 2, url: "/api/placeholder/400/300", caption: "Kitchen framing complete", date: "2025-01-20" }
      ],
      claimHistory: [
        { id: 1, amount: 125000, status: "Approved", date: "2025-01-15", description: "Foundation completion claim" },
        { id: 2, amount: 98000, status: "Pending", date: "2025-01-20", description: "Framing milestone claim" }
      ]
    },
    {
      id: 2,
      name: "Garden Apartments Complex",
      address: "Block 15 Section 87, Canberra ACT",
      status: "Foundation",
      stage: "Excavation Complete",
      progress: 35,
      investedAmount: 650000,
      currentValuation: 720000,
      expectedROI: 18.2,
      completionDate: "December 2025",
      riskLevel: "Medium",
      timeline: ["Planning", "Foundation", "Framing", "Roofing", "Lockup", "Handover"],
      currentStageIndex: 1,
      lastUpdate: "2025-01-19",
      builderPhotos: [
        { id: 3, url: "/api/placeholder/400/300", caption: "Excavation completed", date: "2025-01-19" }
      ],
      claimHistory: [
        { id: 3, amount: 85000, status: "Approved", date: "2025-01-10", description: "Site preparation claim" }
      ]
    },
    {
      id: 3,
      name: "Executive Residences",
      address: "789 Elm Drive, Brisbane QLD",
      status: "Pre-Sale",
      stage: "Planning",
      progress: 15,
      investedAmount: 900000,
      currentValuation: 920000,
      expectedROI: 25.8,
      completionDate: "March 2026",
      riskLevel: "High",
      timeline: ["Planning", "Foundation", "Framing", "Roofing", "Lockup", "Handover"],
      currentStageIndex: 0,
      lastUpdate: "2025-01-21",
      builderPhotos: [
        { id: 4, url: "/api/placeholder/400/300", caption: "Site survey and planning", date: "2025-01-21" }
      ],
      claimHistory: []
    }
  ];

  const documents = [
    {
      id: 1,
      name: "Investment Agreement - Townhouse Development",
      type: "Contract",
      size: "2.4 MB",
      uploadDate: "Dec 15, 2024",
      project: "Luxury Townhouse Development"
    },
    {
      id: 2,
      name: "Financial Projections Q1 2025",
      type: "Financial",
      size: "1.8 MB",
      uploadDate: "Jan 10, 2025",
      project: "Garden Apartments Complex"
    },
    {
      id: 3,
      name: "Construction Timeline Update",
      type: "Progress Report",
      size: "3.1 MB",
      uploadDate: "Jan 20, 2025",
      project: "Luxury Townhouse Development"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'foundation': return 'bg-purple-100 text-purple-800';
      case 'pre-sale': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="text-gray-600">Track your property investments and returns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Funding Letter
          </Button>
          <Button className="bg-lush-primary hover:bg-lush-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download Portfolio Report
          </Button>
        </div>
      </div>

      {/* Investment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">${investorStats.totalInvested.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{investorStats.activeProjects}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average ROI</p>
                <p className="text-2xl font-bold text-gray-900">{investorStats.avgROI}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-gray-900">${investorStats.totalReturns.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                <Banknote className="h-6 w-6 text-gold-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Portfolio Overview', icon: <BarChart className="h-4 w-4" /> },
            { id: 'projects', label: 'Live Projects', icon: <Zap className="h-4 w-4" /> },
            { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <PieChart className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-lush-primary text-lush-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-lush-primary" />
                Investment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-600">${project.investedAmount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {((project.investedAmount / investorStats.totalInvested) * 100).toFixed(1)}%
                      </div>
                      <Progress 
                        value={(project.investedAmount / investorStats.totalInvested) * 100} 
                        className="w-20 h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-lush-primary" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <ArrowUpRight className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-900">+18.5%</div>
                  <div className="text-sm text-green-700">Avg ROI</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Building className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-900">65%</div>
                  <div className="text-sm text-blue-700">Portfolio Complete</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Next Milestone</h5>
                <p className="text-sm text-gray-600">
                  Townhouse Development - Roofing completion expected February 15, 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          {assignedProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-l-4 border-l-lush-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge className={getRiskColor(project.riskLevel)}>
                        {project.riskLevel} Risk
                      </Badge>
                    </div>
                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      {project.address}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Last updated: {project.lastUpdate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Live Updates
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Construction Timeline
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    {project.timeline.map((stage, index) => (
                      <div key={index} className="flex-1 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          index <= project.currentStageIndex 
                            ? 'bg-lush-primary text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index <= project.currentStageIndex ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < project.timeline.length - 1 && (
                          <div className={`flex-1 h-1 mx-2 ${
                            index < project.currentStageIndex 
                              ? 'bg-lush-primary' 
                              : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    {project.timeline.map((stage, index) => (
                      <span key={index} className={`${
                        index === project.currentStageIndex ? 'font-semibold text-lush-primary' : ''
                      }`}>
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-700">Invested Amount</div>
                    <div className="text-lg font-bold text-blue-900">${project.investedAmount.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-700">Current Valuation</div>
                    <div className="text-lg font-bold text-green-900">${project.currentValuation.toLocaleString()}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-purple-700">Expected ROI</div>
                    <div className="text-lg font-bold text-purple-900">{project.expectedROI}%</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Completion Target</div>
                    <div className="text-lg font-bold text-gray-900">{project.completionDate}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Overall Progress</span>
                    <span className="font-bold text-lush-primary">{project.progress}% Complete</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                  <div className="text-sm text-gray-600 mt-1">
                    Current Stage: <span className="font-medium">{project.stage}</span>
                  </div>
                </div>

                {/* Recent Builder Photos */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Recent Progress Photos
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {project.builderPhotos.length} photos
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.builderPhotos.slice(0, 2).map((photo) => (
                      <div key={photo.id} className="bg-gray-100 rounded-lg p-3">
                        <div className="aspect-video bg-gray-200 rounded mb-2 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{photo.caption}</div>
                        <div className="text-xs text-gray-500">{photo.date}</div>
                      </div>
                    ))}
                  </div>
                  {project.builderPhotos.length > 2 && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Eye className="h-4 w-4 mr-2" />
                      View All {project.builderPhotos.length} Photos
                    </Button>
                  )}
                </div>

                {/* Claims History */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payment Claims
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Read-only
                    </span>
                  </h4>
                  {project.claimHistory.length > 0 ? (
                    <div className="space-y-2">
                      {project.claimHistory.map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{claim.description}</div>
                            <div className="text-sm text-gray-600">{claim.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">${claim.amount.toLocaleString()}</div>
                            <Badge className={claim.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {claim.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                      No payment claims submitted yet for this project.
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Investment Documents</h3>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
          
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                      <div className="text-sm text-gray-600">
                        {doc.project} • {doc.type} • {doc.size}
                      </div>
                      <div className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ROI Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedProjects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{project.name}</span>
                      <span className="font-bold">{project.expectedROI}%</span>
                    </div>
                    <Progress value={project.expectedROI} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-900">Low Risk Projects</span>
                  <span className="font-bold text-green-900">1</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-yellow-900">Medium Risk Projects</span>
                  <span className="font-bold text-yellow-900">1</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-red-900">High Risk Projects</span>
                  <span className="font-bold text-red-900">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;