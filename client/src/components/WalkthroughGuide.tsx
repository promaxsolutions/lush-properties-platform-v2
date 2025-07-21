import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play,
  Pause,
  RotateCcw,
  Eye
} from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll';
}

interface WalkthroughGuideProps {
  isActive: boolean;
  onClose: () => void;
  userRole?: string;
}

const WalkthroughGuide = ({ isActive, onClose, userRole = 'admin' }: WalkthroughGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  // Define role-specific walkthrough steps
  const getStepsForRole = (role: string): WalkthroughStep[] => {
    switch (role) {
      case 'admin':
        return [
          {
            id: 'dashboard-overview',
            title: 'Project Dashboard Overview',
            description: 'This is your main dashboard where you can see all active projects, financial summaries, and system health at a glance.',
            target: '[data-tour="dashboard-stats"]',
            position: 'bottom'
          },
          {
            id: 'project-tracking',
            title: 'Project Tracking & Funding',
            description: 'Track funding progress, equity positions, and drawdown schedules for each development project.',
            target: '[data-tour="project-cards"]',
            position: 'top'
          },
          {
            id: 'document-upload',
            title: 'Document Management',
            description: 'Upload and manage progress documents, receipts, and claims for automated processing.',
            target: '[data-tour="upload-section"]',
            position: 'left'
          },
          {
            id: 'claims-processing',
            title: 'Automated Claims Processing',
            description: 'Submit and track progress claims with automated email workflows to lenders and stakeholders.',
            target: '[data-tour="claims-button"]',
            position: 'bottom'
          },
          {
            id: 'ai-insights',
            title: 'AI-Powered Insights',
            description: 'Get intelligent recommendations for project optimization, risk assessment, and financial planning.',
            target: '[data-tour="ai-assistant"]',
            position: 'left'
          }
        ];
      
      case 'investor':
        return [
          {
            id: 'investment-overview',
            title: 'Investment Portfolio',
            description: 'View your investment portfolio with real-time project valuations and ROI tracking.',
            target: '[data-tour="investment-stats"]',
            position: 'bottom'
          },
          {
            id: 'funding-opportunities',
            title: 'Funding Opportunities',
            description: 'Discover new investment opportunities with AI-powered market analysis and risk scoring.',
            target: '[data-tour="funding-section"]',
            position: 'top'
          },
          {
            id: 'performance-metrics',
            title: 'Performance Analytics',
            description: 'Track project performance, market trends, and profitability forecasts with detailed charts.',
            target: '[data-tour="charts-section"]',
            position: 'bottom'
          }
        ];
      
      case 'builder':
        return [
          {
            id: 'progress-upload',
            title: 'Upload Progress Photos',
            description: 'Upload construction photos and documents to keep clients and stakeholders updated on build progress.',
            target: '[data-tour="photo-upload"]',
            position: 'bottom'
          },
          {
            id: 'milestone-tracking',
            title: 'Milestone Management',
            description: 'Update project milestones and track completion status for accurate progress reporting.',
            target: '[data-tour="milestone-section"]',
            position: 'top'
          },
          {
            id: 'payment-claims',
            title: 'Submit Payment Claims',
            description: 'Create and submit payment claims for completed work with automated approval workflows.',
            target: '[data-tour="payment-claims"]',
            position: 'left'
          }
        ];
      
      default:
        return [
          {
            id: 'getting-started',
            title: 'Welcome to Lush Properties',
            description: 'This is your project management dashboard where you can track progress and manage your property developments.',
            target: 'body',
            position: 'center'
          }
        ];
    }
  };

  const steps = getStepsForRole(userRole);

  useEffect(() => {
    if (!isActive) {
      removeHighlight();
      return;
    }

    highlightStep(currentStep);
  }, [isActive, currentStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isActive) {
      interval = setInterval(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000); // 3 seconds per step
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, isActive]);

  const highlightStep = (stepIndex: number) => {
    removeHighlight();
    
    const step = steps[stepIndex];
    if (!step) return;

    const element = document.querySelector(step.target) as HTMLElement;
    if (!element) {
      // Fallback: highlight the entire viewport
      createOverlay('center');
      return;
    }

    setHighlightedElement(element);
    
    // Add highlight class
    element.style.position = 'relative';
    element.style.zIndex = '1001';
    element.style.boxShadow = '0 0 0 4px rgba(0, 113, 68, 0.5), 0 0 0 8px rgba(0, 113, 68, 0.2)';
    element.style.borderRadius = '8px';
    
    // Scroll element into view
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });

    // Create overlay
    createOverlay(step.position, element);
  };

  const createOverlay = (position: string, targetElement?: HTMLElement) => {
    // Remove existing overlay
    const existingOverlay = document.getElementById('walkthrough-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Create dark overlay
    const overlay = document.createElement('div');
    overlay.id = 'walkthrough-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      pointer-events: none;
    `;

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      
      // Create cutout for highlighted element
      overlay.style.background = `
        radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.5) 41%)
      `;
      overlay.style.maskImage = `
        radial-gradient(ellipse ${rect.width + 20}px ${rect.height + 20}px at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px, transparent 50%, black 51%)
      `;
    }

    document.body.appendChild(overlay);
  };

  const removeHighlight = () => {
    if (highlightedElement) {
      highlightedElement.style.position = '';
      highlightedElement.style.zIndex = '';
      highlightedElement.style.boxShadow = '';
      highlightedElement.style.borderRadius = '';
      setHighlightedElement(null);
    }

    const overlay = document.getElementById('walkthrough-overlay');
    if (overlay) {
      overlay.remove();
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    removeHighlight();
    setIsPlaying(false);
    setCurrentStep(0);
    onClose();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (!isActive || steps.length === 0) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Control Panel */}
      <Card className="fixed top-4 right-4 z-[1002] p-4 shadow-xl min-w-[350px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lush-primary rounded-full flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Investor Walkthrough</h3>
              <p className="text-xs text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {currentStepData.title}
            </h4>
            <p className="text-sm text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-lush-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="flex-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Tour
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Auto Play
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              onClick={handleNext}
              className="bg-lush-primary hover:bg-lush-primary/90"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <strong>💡 Tip:</strong> This walkthrough can be exported as a video tour for training and onboarding new users.
          </div>
        </div>
      </Card>
    </>
  );
};

export default WalkthroughGuide;