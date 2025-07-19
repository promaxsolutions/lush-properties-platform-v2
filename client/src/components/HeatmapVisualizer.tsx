import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

interface ProjectHealth {
  projectId: number;
  projectName: string;
  stage: string;
  budgetHealth: 'excellent' | 'good' | 'warning' | 'critical';
  timelineHealth: 'excellent' | 'good' | 'warning' | 'critical';
  profitHealth: 'excellent' | 'good' | 'warning' | 'critical';
  overallScore: number;
  budgetUtilization: number;
  timelineProgress: number;
  profitMargin: number;
  riskFactors: string[];
  recommendations: string[];
}

const HeatmapVisualizer = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  const projectsHealth: ProjectHealth[] = [
    {
      projectId: 1,
      projectName: "56 Inge King Crescent",
      stage: "Framing",
      budgetHealth: 'good',
      timelineHealth: 'excellent',
      profitHealth: 'excellent',
      overallScore: 85,
      budgetUtilization: 68,
      timelineProgress: 45,
      profitMargin: 31.7,
      riskFactors: [
        "Material costs trending up 3%",
        "Weather delays possible next month"
      ],
      recommendations: [
        "Lock in remaining materials pricing",
        "Consider weather contingency for roofing phase"
      ]
    },
    {
      projectId: 2,
      projectName: "Block 15 Section 87",
      stage: "Slab",
      budgetHealth: 'warning',
      timelineHealth: 'good',
      profitHealth: 'good',
      overallScore: 72,
      budgetUtilization: 82,
      timelineProgress: 25,
      profitMargin: 21.0,
      riskFactors: [
        "Budget 82% utilized at 25% completion",
        "Site access challenges during wet weather",
        "Subcontractor availability concerns"
      ],
      recommendations: [
        "Review remaining budget allocation",
        "Accelerate critical path items",
        "Secure backup subcontractors"
      ]
    }
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthTextColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const portfolioMetrics = {
    averageScore: Math.round(projectsHealth.reduce((sum, p) => sum + p.overallScore, 0) / projectsHealth.length),
    totalProjects: projectsHealth.length,
    excellentHealth: projectsHealth.filter(p => p.overallScore >= 80).length,
    needsAttention: projectsHealth.filter(p => p.overallScore < 70).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Portfolio Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(portfolioMetrics.averageScore)}`}>
                  {portfolioMetrics.averageScore}/100
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Excellent Health</p>
                <p className="text-2xl font-bold text-green-900">
                  {portfolioMetrics.excellentHealth}/{portfolioMetrics.totalProjects}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Needs Attention</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {portfolioMetrics.needsAttention}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Active Projects</p>
                <p className="text-2xl font-bold text-purple-900">
                  {portfolioMetrics.totalProjects}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>🧮 Financial Health Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Project</th>
                  <th className="text-center p-3">Stage</th>
                  <th className="text-center p-3">Budget Health</th>
                  <th className="text-center p-3">Timeline Health</th>
                  <th className="text-center p-3">Profit Health</th>
                  <th className="text-center p-3">Overall Score</th>
                  <th className="text-center p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {projectsHealth.map((project) => (
                  <tr 
                    key={project.projectId} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedProject(
                      selectedProject === project.projectId ? null : project.projectId
                    )}
                  >
                    <td className="p-3 font-medium">{project.projectName}</td>
                    <td className="p-3 text-center">{project.stage}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <div className={`w-4 h-4 rounded ${getHealthColor(project.budgetHealth)} mr-2`}></div>
                        <span className={getHealthTextColor(project.budgetHealth)}>
                          {project.budgetHealth}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <div className={`w-4 h-4 rounded ${getHealthColor(project.timelineHealth)} mr-2`}></div>
                        <span className={getHealthTextColor(project.timelineHealth)}>
                          {project.timelineHealth}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <div className={`w-4 h-4 rounded ${getHealthColor(project.profitHealth)} mr-2`}></div>
                        <span className={getHealthTextColor(project.profitHealth)}>
                          {project.profitHealth}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-bold ${getScoreColor(project.overallScore)}`}>
                        {project.overallScore}/100
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Project Analysis */}
      {selectedProject && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>
              📊 Detailed Analysis: {projectsHealth.find(p => p.projectId === selectedProject)?.projectName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const project = projectsHealth.find(p => p.projectId === selectedProject);
              if (!project) return null;

              return (
                <div className="space-y-6">
                  {/* Progress Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Budget Utilization</span>
                        <span className="text-sm text-gray-600">{project.budgetUtilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            project.budgetUtilization > 80 ? 'bg-red-500' :
                            project.budgetUtilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(project.budgetUtilization, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Timeline Progress</span>
                        <span className="text-sm text-gray-600">{project.timelineProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${project.timelineProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Profit Margin</span>
                        <span className="text-sm text-gray-600">{project.profitMargin}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            project.profitMargin > 25 ? 'bg-green-500' :
                            project.profitMargin > 15 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(project.profitMargin * 3, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">⚠️ Risk Factors</h4>
                    <div className="space-y-2">
                      {project.riskFactors.map((risk, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">{risk}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">💡 AI Recommendations</h4>
                    <div className="space-y-2">
                      {project.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Generate Report
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                      Schedule Review
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm">
                      Alert Team
                    </button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Health Legend */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Health Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm"><strong>Excellent:</strong> On track, no issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm"><strong>Good:</strong> Minor variations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-sm"><strong>Warning:</strong> Requires attention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm"><strong>Critical:</strong> Immediate action needed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapVisualizer;