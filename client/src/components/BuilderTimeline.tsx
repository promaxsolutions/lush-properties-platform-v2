import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Construction, 
  Brain, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  TrendingUp,
  Target,
  RefreshCw
} from "lucide-react";
import { 
  fetchProjectTimeline, 
  detectProjectStage, 
  analyzeProjectPhotos, 
  predictNextMilestone,
  type TimelineStep,
  type ProjectStage
} from "../utils/projectAI";

interface Project {
  id: string;
  name: string;
  status: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

interface BuilderTimelineProps {
  project: Project;
  user: User;
}

const BuilderTimeline = ({ project, user }: BuilderTimelineProps) => {
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);
  const [aiStage, setAiStage] = useState<ProjectStage | null>(null);
  const [photoAnalysis, setPhotoAnalysis] = useState<any>(null);
  const [nextMilestone, setNextMilestone] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [project.id]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      // Load all project AI data
      const [timelineData, stageData, photoData, milestoneData] = await Promise.all([
        fetchProjectTimeline(project.id),
        detectProjectStage(project.id),
        analyzeProjectPhotos(project.id),
        predictNextMilestone(project.id)
      ]);

      setTimeline(timelineData);
      setAiStage(stageData);
      setPhotoAnalysis(photoData);
      setNextMilestone(milestoneData);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    setRefreshing(true);
    try {
      const [stageData, photoData] = await Promise.all([
        detectProjectStage(project.id),
        analyzeProjectPhotos(project.id)
      ]);
      
      setAiStage(stageData);
      setPhotoAnalysis(photoData);
      
      window.dispatchEvent(new CustomEvent('uploadComplete', {
        detail: { message: 'AI analysis refreshed successfully' }
      }));
    } catch (error) {
      console.error('Failed to refresh analysis:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'upcoming':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading project timeline and AI analysis...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-6 w-6" />
            Builder Timeline & AI Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            AI-powered project stage detection and timeline management for {project.name}
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={refreshAnalysis} disabled={refreshing} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh AI Analysis
          </Button>
        </CardContent>
      </Card>

      {/* AI Current Stage */}
      {aiStage && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="h-5 w-5" />
              AI Current Stage Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-blue-900">Current Stage</h4>
                <p className="text-blue-700">{aiStage.label}</p>
                <div className="mt-2">
                  <div className="text-xs text-blue-600">Confidence</div>
                  <Progress value={aiStage.confidence * 100} className="h-2 bg-blue-200" />
                  <div className="text-xs text-blue-600 mt-1">{(aiStage.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Next Milestone</h4>
                <p className="text-blue-700">{aiStage.nextMilestone}</p>
                {aiStage.daysRemaining && (
                  <div className="text-sm text-blue-600 mt-1">
                    ~{aiStage.daysRemaining} days remaining
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Progress</h4>
                {photoAnalysis && (
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-blue-800">
                      {photoAnalysis.progressPercentage}%
                    </div>
                    <div className="text-xs text-blue-600">
                      Quality Score: {photoAnalysis.qualityScore}/10
                    </div>
                  </div>
                )}
              </div>
            </div>

            {aiStage.aiRecommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">AI Recommendations</h4>
                <div className="space-y-1">
                  {aiStage.aiRecommendations.map((recommendation, i) => (
                    <div key={i} className="text-sm text-blue-700 flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Photo Analysis */}
      {photoAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              AI Photo Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Detected Elements</h4>
                <div className="flex flex-wrap gap-2">
                  {photoAnalysis.detectedElements.map((element: string, i: number) => (
                    <Badge key={i} variant="outline">{element}</Badge>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-600">Stage Confidence</div>
                  <Progress value={photoAnalysis.stageConfidence * 100} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {(photoAnalysis.stageConfidence * 100).toFixed(1)}% confidence
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <div className="space-y-1">
                  {photoAnalysis.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Construction Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              {timeline.map((step, i) => (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={`w-8 h-8 rounded-full border-4 border-white ${getStatusColor(step.status)} flex items-center justify-center z-10`}>
                    {getStatusIcon(step.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <time className="text-sm text-gray-500">
                          {new Date(step.date).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {step.stage}
                      </Badge>
                      {step.confidence && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="h-3 w-3" />
                          {(step.confidence * 100).toFixed(0)}% confidence
                        </div>
                      )}
                      <Badge className={
                        step.status === 'completed' ? 'bg-green-100 text-green-800' :
                        step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {step.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Milestone Prediction */}
      {nextMilestone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Next Milestone Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{nextMilestone.milestone}</h4>
                <div className="text-sm text-gray-600 mb-3">
                  Estimated completion: {new Date(nextMilestone.estimatedDate).toLocaleDateString()}
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Requirements:</h5>
                  {nextMilestone.requirements.map((req: string, i: number) => (
                    <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {req}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-sm mb-2">Risk Factors:</h5>
                <div className="space-y-1">
                  {nextMilestone.riskFactors.map((risk: string, i: number) => (
                    <Alert key={i} className="p-2">
                      <AlertCircle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        {risk}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {timeline.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {timeline.filter(s => s.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {timeline.filter(s => s.status === 'upcoming').length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((timeline.filter(s => s.status === 'completed').length / timeline.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuilderTimeline;