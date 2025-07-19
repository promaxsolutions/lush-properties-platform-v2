import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AIWorkflow {
  id: string;
  type: 'loan_optimization' | 'builder_analysis' | 'cost_alert' | 'timeline_prediction' | 'funding_assessment';
  status: 'active' | 'completed' | 'pending' | 'monitoring';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  impact: string;
  confidence: number;
  createdAt: Date;
  lastUpdated: Date;
}

const AIWorkflowEngine = () => {
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([
    {
      id: 'wf_001',
      type: 'loan_optimization',
      status: 'active',
      priority: 'high',
      title: 'Loan Rate Optimization Opportunity',
      description: 'AI analysis detected better loan terms available for active projects',
      recommendation: 'ORDE offers 4.99% fixed rate vs current 5.4% variable - potential $22K savings',
      impact: 'Cost Reduction: $22,000 over loan term',
      confidence: 94,
      createdAt: new Date('2024-07-19T10:30:00'),
      lastUpdated: new Date('2024-07-19T16:00:00')
    },
    {
      id: 'wf_002',
      type: 'builder_analysis',
      status: 'completed',
      priority: 'medium',
      title: 'Builder Performance Assessment',
      description: 'Comprehensive analysis of MacHomes performance metrics',
      recommendation: 'MacHomes: 4.7★ reliability, 3.9★ timeline adherence - Recommended for future projects',
      impact: 'Risk Mitigation: 15% improvement in project timeline reliability',
      confidence: 87,
      createdAt: new Date('2024-07-18T14:20:00'),
      lastUpdated: new Date('2024-07-19T09:15:00')
    },
    {
      id: 'wf_003',
      type: 'funding_assessment',
      status: 'active',
      priority: 'high',
      title: 'Investor Readiness Analysis',
      description: 'AI-powered fundability assessment for Block 15 Section 87',
      recommendation: 'Project scores 8.7/10 fundability - Ready for investor presentation package',
      impact: 'Funding Opportunity: $150K additional investment potential',
      confidence: 91,
      createdAt: new Date('2024-07-19T11:45:00'),
      lastUpdated: new Date('2024-07-19T15:30:00')
    },
    {
      id: 'wf_004',
      type: 'cost_alert',
      status: 'monitoring',
      priority: 'medium',
      title: 'Cost Variance Detection',
      description: 'Roofing quote analysis shows market deviation',
      recommendation: 'Current roofing quote 12% above Whitlam area average - Negotiate or seek alternatives',
      impact: 'Potential Savings: $3,200 if alternative sourced',
      confidence: 83,
      createdAt: new Date('2024-07-19T13:10:00'),
      lastUpdated: new Date('2024-07-19T16:05:00')
    },
    {
      id: 'wf_005',
      type: 'timeline_prediction',
      status: 'active',
      priority: 'low',
      title: 'Project Timeline Optimization',
      description: 'AI predicts completion timeline adjustments needed',
      recommendation: 'Plumbing final inspection due this week - Auto-reminder sent to MacHomes',
      impact: 'Schedule Adherence: Maintains 2-week buffer for handover',
      confidence: 76,
      createdAt: new Date('2024-07-19T08:20:00'),
      lastUpdated: new Date('2024-07-19T16:10:00')
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'monitoring': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'monitoring': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const executeWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf => 
      wf.id === workflowId 
        ? { ...wf, status: 'completed', lastUpdated: new Date() }
        : wf
    ));
    alert('✅ AI Workflow executed successfully! Recommendations have been applied.');
  };

  const dismissWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
  };

  const activeWorkflows = workflows.filter(wf => wf.status === 'active').length;
  const completedWorkflows = workflows.filter(wf => wf.status === 'completed').length;
  const highPriorityWorkflows = workflows.filter(wf => wf.priority === 'high').length;

  return (
    <div className="p-6 space-y-6">
      {/* AI Engine Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Active Workflows</p>
                <p className="text-2xl font-bold text-purple-900">{activeWorkflows}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{completedWorkflows}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">High Priority</p>
                <p className="text-2xl font-bold text-red-900">{highPriorityWorkflows}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">AI Confidence</p>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.round(workflows.reduce((sum, wf) => sum + wf.confidence, 0) / workflows.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            🤖 AI Workflow Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className={`border rounded-lg p-4 ${
                  selectedWorkflow === workflow.id ? 'ring-2 ring-blue-500' : ''
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setSelectedWorkflow(
                  selectedWorkflow === workflow.id ? null : workflow.id
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(workflow.status)}
                      <h4 className="font-semibold text-lg">{workflow.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(workflow.priority)}`}>
                        {workflow.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{workflow.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getConfidenceColor(workflow.confidence)}`}>
                      {workflow.confidence}% confidence
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated {workflow.lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <h5 className="font-medium text-blue-800 mb-1">AI Recommendation:</h5>
                  <p className="text-blue-700 text-sm">{workflow.recommendation}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                  <h5 className="font-medium text-green-800 mb-1">Expected Impact:</h5>
                  <p className="text-green-700 text-sm">{workflow.impact}</p>
                </div>

                {selectedWorkflow === workflow.id && (
                  <div className="flex gap-2 pt-3 border-t">
                    {workflow.status === 'active' && (
                      <>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            executeWorkflow(workflow.id);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Execute Recommendation
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissWorkflow(workflow.id);
                          }}
                        >
                          Dismiss
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('📊 Detailed analysis report would open here');
                      }}
                    >
                      View Analysis
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI System Status */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ AI System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-green-800">Market Analysis Engine</p>
                <p className="text-sm text-green-600">Running • Last scan: 2 min ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border border-blue-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-blue-800">Prediction Models</p>
                <p className="text-sm text-blue-600">Active • 91% accuracy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded border border-purple-200">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-purple-800">OpenAI Integration</p>
                <p className="text-sm text-purple-600">Connected • GPT-4 Turbo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIWorkflowEngine;