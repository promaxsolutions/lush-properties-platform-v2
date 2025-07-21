import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home,
  CheckCircle,
  Clock,
  Camera,
  FileText,
  MessageCircle,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

interface ClientOnboardingProps {
  clientName?: string;
  projectAddress?: string;
  onComplete: () => void;
}

const ClientOnboarding = ({ 
  clientName = "Jennifer", 
  projectAddress = "56 Inge King Crescent, Scullin ACT 2614",
  onComplete 
}: ClientOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    {
      title: "Welcome to Your Project",
      icon: <Home className="h-6 w-6" />,
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-lush-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Welcome, {clientName}! 🎉
          </h3>
          <p className="text-gray-600 text-lg">
            Your dream home at <strong>{projectAddress}</strong> is now under construction.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-800 text-sm">
              This dashboard will be your central hub to track progress, view photos, 
              and communicate with your build team throughout the entire construction process.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Track Your Build Timeline",
      icon: <Clock className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Clock className="h-12 w-12 text-lush-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Real-Time Progress Tracking
            </h3>
            <p className="text-gray-600">
              Watch your home come to life with detailed milestone tracking
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900">Foundation Complete</div>
                <div className="text-sm text-green-700">Completed 2 weeks ago</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Framing in Progress</div>
                <div className="text-sm text-blue-700">75% complete - On schedule</div>
              </div>
              <Progress value={75} className="w-20 h-2" />
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-700">Roofing</div>
                <div className="text-sm text-gray-500">Starts February 1st</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "View Progress Photos",
      icon: <Camera className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Camera className="h-12 w-12 text-lush-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Visual Progress Updates
            </h3>
            <p className="text-gray-600">
              Your builder uploads photos at each milestone so you can see the progress
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="aspect-video bg-gray-300 rounded-lg mb-2 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-500" />
              </div>
              <div className="text-sm font-medium text-gray-900">Foundation</div>
              <div className="text-xs text-gray-500">Dec 15, 2024</div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="aspect-video bg-gray-300 rounded-lg mb-2 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-500" />
              </div>
              <div className="text-sm font-medium text-gray-900">Framing</div>
              <div className="text-xs text-gray-500">Jan 10, 2025</div>
            </div>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Star className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Pro Tip:</strong> Photos are automatically organized by construction phase. 
              You'll receive notifications when new photos are uploaded!
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      title: "Request Upgrades & Changes",
      icon: <FileText className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-lush-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Upgrade & Variation Requests
            </h3>
            <p className="text-gray-600">
              Want to upgrade your kitchen or add a feature? Submit requests directly through your dashboard
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">Kitchen Benchtop Upgrade</div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Quoted</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Stone benchtop upgrade to Caesar Stone</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">+$3,200</span>
                </span>
                <span className="text-gray-500">Quoted 2 days ago</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-lush-primary text-lush-primary hover:bg-lush-primary hover:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Request New Upgrade
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Stay Connected",
      icon: <MessageCircle className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-lush-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Direct Communication
            </h3>
            <p className="text-gray-600">
              Get instant support and updates from your build team
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">MJ</span>
                </div>
                <div className="font-medium text-green-900">Mike Johnson</div>
                <div className="text-sm text-green-700">Site Manager</div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div className="font-medium text-blue-900">AI Assistant</div>
                <div className="text-sm text-blue-700">24/7 Support</div>
              </div>
            </div>
            
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                You'll receive automatic notifications for milestones, photo uploads, 
                and any important updates about your build.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Store onboarding completion
    localStorage.setItem('lush_onboarding_completed', 'true');
    
    // Simulate completion delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-lush-primary to-lush-accent rounded-xl flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</div>
              <Progress value={progress} className="w-32 h-2 mt-1" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {steps[currentStep].title}
          </CardTitle>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-lush-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="min-h-[400px]">
            {steps[currentStep].content}
          </div>
          
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={isCompleting}
              className="flex-1 bg-lush-primary hover:bg-lush-primary/90 text-white"
            >
              {isCompleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting up...
                </div>
              ) : currentStep === steps.length - 1 ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Start Using Dashboard
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOnboarding;