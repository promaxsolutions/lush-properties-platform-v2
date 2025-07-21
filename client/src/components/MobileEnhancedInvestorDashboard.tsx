import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  PieChart,
  Download,
  Eye,
  ArrowUpRight,
  MapPin
} from 'lucide-react';

const MobileEnhancedInvestorDashboard = () => {
  const investmentData = {
    totalInvested: 2400000,
    activeProjects: 5,
    averageROI: 18.5,
    totalReturns: 444000,
    portfolioValue: 2844000
  };

  const projects = [
    {
      id: 1,
      name: "Scullin Heights Development",
      address: "56 Inge King Crescent, Scullin ACT 2614",
      investment: 480000,
      currentValue: 562000,
      roi: 17.1,
      progress: 65,
      stage: "Framing",
      riskLevel: "Low",
      expectedCompletion: "Sep 2025"
    },
    {
      id: 2,
      name: "Forrest Premium Townhouses",
      address: "123 Melbourne Avenue, Forrest ACT 2603",
      investment: 650000,
      currentValue: 780000,
      roi: 20.0,
      progress: 85,
      stage: "Finishing",
      riskLevel: "Low",
      expectedCompletion: "Mar 2025"
    },
    {
      id: 3,
      name: "Barton Luxury Apartments",
      address: "45 Macquarie Street, Barton ACT 2600",
      investment: 1270000,
      currentValue: 1502000,
      roi: 18.3,
      progress: 40,
      stage: "Foundation",
      riskLevel: "Medium",
      expectedCompletion: "Dec 2025"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'foundation': return 'bg-blue-100 text-blue-800';
      case 'framing': return 'bg-purple-100 text-purple-800';
      case 'finishing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                💼 Investment Portfolio
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Lush Properties Pty Ltd
              </p>
            </div>
            <Button size="sm" className="bg-lush-primary hover:bg-lush-primary/90 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Portfolio Overview - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-green-700">Total Invested</p>
                  <p className="text-sm sm:text-lg font-bold text-green-900 truncate">
                    {formatCurrency(investmentData.totalInvested)}
                  </p>
                </div>
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-700">Active Projects</p>
                  <p className="text-sm sm:text-lg font-bold text-blue-900">
                    {investmentData.activeProjects}
                  </p>
                </div>
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-purple-700">Avg ROI</p>
                  <p className="text-sm sm:text-lg font-bold text-purple-900">
                    {investmentData.averageROI}%
                  </p>
                </div>
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-orange-700">Total Returns</p>
                  <p className="text-sm sm:text-lg font-bold text-orange-900 truncate">
                    {formatCurrency(investmentData.totalReturns)}
                  </p>
                </div>
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-indigo-700">Portfolio Value</p>
                  <p className="text-sm sm:text-lg font-bold text-indigo-900 truncate">
                    {formatCurrency(investmentData.portfolioValue)}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List - Mobile First */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Active Investments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
              {projects.map((project) => (
                <Card key={project.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3">
                      {/* Project Header */}
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {project.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{project.address}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-3">
                          <Badge variant="outline" className={`text-xs ${getRiskColor(project.riskLevel)}`}>
                            {project.riskLevel} Risk
                          </Badge>
                          <Badge variant="secondary" className={`text-xs ${getStageColor(project.stage)}`}>
                            {project.stage}
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Build Progress</span>
                          <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      {/* Financial Data - Mobile Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Invested</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            {formatCurrency(project.investment)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Current Value</p>
                          <p className="text-xs sm:text-sm font-semibold text-green-600">
                            {formatCurrency(project.currentValue)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">ROI</p>
                          <p className="text-xs sm:text-sm font-semibold text-blue-600">
                            {project.roi}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Completion</p>
                          <p className="text-xs sm:text-sm font-semibold text-purple-600">
                            {project.expectedCompletion}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
                          <Download className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">
            📱 Optimized for mobile • Real-time updates • Lush Properties Pty Ltd
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileEnhancedInvestorDashboard;