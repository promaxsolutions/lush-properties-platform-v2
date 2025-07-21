// Project AI utilities for timeline and stage detection

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  stage: string;
  confidence?: number;
}

export interface ProjectStage {
  label: string;
  confidence: number;
  nextMilestone: string;
  daysRemaining?: number;
  aiRecommendations: string[];
}

export const fetchProjectTimeline = async (projectId: string): Promise<TimelineStep[]> => {
  try {
    const response = await fetch(`/api/projects/timeline/${projectId}`);
    const result = await response.json();
    return result.success ? result.timeline : getSampleTimeline();
  } catch (error) {
    console.error('Failed to fetch project timeline:', error);
    return getSampleTimeline();
  }
};

export const detectProjectStage = async (projectId: string): Promise<ProjectStage> => {
  try {
    const response = await fetch(`/api/ai/detect-stage/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.json();
    return result.success ? result.stage : getSampleStage();
  } catch (error) {
    console.error('Failed to detect project stage:', error);
    return getSampleStage();
  }
};

export const analyzeProjectPhotos = async (projectId: string): Promise<{
  stageConfidence: number;
  detectedElements: string[];
  progressPercentage: number;
  qualityScore: number;
  recommendations: string[];
}> => {
  try {
    const response = await fetch(`/api/ai/analyze-photos/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.json();
    return result.success ? result : {
      stageConfidence: 0.85,
      detectedElements: ['foundation', 'concrete_work', 'reinforcement'],
      progressPercentage: 65,
      qualityScore: 8.2,
      recommendations: ['Continue with quality standards', 'Schedule next inspection']
    };
  } catch (error) {
    console.error('Failed to analyze project photos:', error);
    return {
      stageConfidence: 0,
      detectedElements: [],
      progressPercentage: 0,
      qualityScore: 0,
      recommendations: ['Photo analysis unavailable']
    };
  }
};

export const predictNextMilestone = async (projectId: string): Promise<{
  milestone: string;
  estimatedDate: string;
  requirements: string[];
  riskFactors: string[];
}> => {
  try {
    const response = await fetch(`/api/ai/predict-milestone/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.json();
    return result.success ? result : {
      milestone: 'Frame Complete',
      estimatedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requirements: ['Timber delivery', 'Building permit approval', 'Weather conditions'],
      riskFactors: ['Material delays', 'Weather dependency']
    };
  } catch (error) {
    console.error('Failed to predict next milestone:', error);
    return {
      milestone: 'Unknown',
      estimatedDate: new Date().toISOString().split('T')[0],
      requirements: [],
      riskFactors: ['Prediction unavailable']
    };
  }
};

// Sample data generators
const getSampleTimeline = (): TimelineStep[] => [
  {
    id: '1',
    title: 'Project Initiation',
    description: 'Project planning, permits, and site preparation completed',
    date: '2024-01-15',
    status: 'completed',
    stage: 'Planning',
    confidence: 1.0
  },
  {
    id: '2',
    title: 'Site Preparation',
    description: 'Excavation and site leveling completed',
    date: '2024-01-22',
    status: 'completed',
    stage: 'Site Prep',
    confidence: 0.95
  },
  {
    id: '3',
    title: 'Foundation Complete',
    description: 'Concrete foundation poured and cured successfully',
    date: '2024-02-05',
    status: 'completed',
    stage: 'Foundation',
    confidence: 0.98
  },
  {
    id: '4',
    title: 'Frame Construction',
    description: 'Timber frame installation in progress',
    date: '2024-02-20',
    status: 'in-progress',
    stage: 'Framing',
    confidence: 0.87
  },
  {
    id: '5',
    title: 'Roofing Installation',
    description: 'Roof structure and weatherproofing to begin',
    date: '2024-03-10',
    status: 'upcoming',
    stage: 'Roofing',
    confidence: 0.75
  },
  {
    id: '6',
    title: 'Electrical & Plumbing',
    description: 'Rough-in work for utilities',
    date: '2024-03-25',
    status: 'upcoming',
    stage: 'MEP',
    confidence: 0.70
  }
];

const getSampleStage = (): ProjectStage => ({
  label: 'Frame Construction (In Progress)',
  confidence: 0.87,
  nextMilestone: 'Lockup Complete',
  daysRemaining: 18,
  aiRecommendations: [
    'Continue timber frame installation as per schedule',
    'Schedule building inspection for frame completion',
    'Prepare materials for lockup phase',
    'Monitor weather conditions for optimal work days'
  ]
});