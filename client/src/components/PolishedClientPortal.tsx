import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home,
  Camera,
  DollarSign,
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface ProjectMilestone {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  completedDate?: Date;
  estimatedDate?: Date;
  progress: number;
}

interface ProgressPhoto {
  id: string;
  stage: string;
  imageUrl: string;
  uploadedDate: Date;
  description: string;
}

const PolishedClientPortal = () => {
  const [selectedProject] = useState({
    id: 'proj-001',
    name: '56 Inge King Crescent',
    address: '56 Inge King Crescent, Scullin ACT 2614',
    totalValue: 850000,
    paidToDate: 425000,
    currentStage: 'Framing',
    overallProgress: 45,
    estimatedCompletion: new Date('2025-03-15')
  });

  const [milestones] = useState<ProjectMilestone[]>([
    { id: '1', name: 'Foundation', status: 'completed', completedDate: new Date('2024-12-15'), progress: 100 },
    { id: '2', name: 'Framing', status: 'in-progress', progress: 75 },
    { id: '3', name: 'Roofing', status: 'upcoming', estimatedDate: new Date('2025-02-01'), progress: 0 },
    { id: '4', name: 'Plumbing Rough-in', status: 'upcoming', estimatedDate: new Date('2025-02-15'), progress: 0 },
    { id: '5', name: 'Electrical Rough-in', status: 'upcoming', estimatedDate: new Date('2025-02-20'), progress: 0 },
    { id: '6', name: 'Insulation', status: 'upcoming', estimatedDate: new Date('2025-03-01'), progress: 0 },
    { id: '7', name: 'Handover', status: 'upcoming', estimatedDate: new Date('2025-03-15'), progress: 0 }
  ]);

  const [progressPhotos] = useState<ProgressPhoto[]>([
    {
      id: '1',
      stage: 'Foundation',
      imageUrl: '/api/placeholder/400/300',
      uploadedDate: new Date('2024-12-15'),
      description: 'Foundation completed - concrete poured and cured'
    },
    {
      id: '2',
      stage: 'Framing',
      imageUrl: '/api/placeholder/400/300',
      uploadedDate: new Date('2025-01-10'),
      description: 'Wall framing in progress - 75% complete'
    }
  ]);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'upcoming': return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-lush-primary rounded-xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                👋 Hi Jennifer, here's your project dashboard.
              </h1>
              <p className="text-gray-600 mt-1">
                Track your property development progress and manage upgrades
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Project Overview */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Home className="h-6 w-6 text-lush-primary" />
              {selectedProject.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{selectedProject.address}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-lush-primary">{selectedProject.overallProgress}%</span>
              </div>
              <Progress value={selectedProject.overallProgress} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Started: Dec 2024</span>
                <span>Est. Completion: {selectedProject.estimatedCompletion.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Value</p>
                    <p className="text-xl font-bold text-green-900">${selectedProject.totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Paid to Date</p>
                    <p className="text-xl font-bold text-blue-900">${selectedProject.paidToDate.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Current Stage</p>
                    <p className="text-xl font-bold text-purple-900">{selectedProject.currentStage}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Progress */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Calendar className="h-6 w-6 text-lush-primary" />
              Construction Milestones
            </CardTitle>
            <p className="text-gray-600">Track progress through each construction phase</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    {getStatusIcon(milestone.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                        {milestone.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    {milestone.status === 'in-progress' && (
                      <div className="mb-2">
                        <Progress value={milestone.progress} className="h-2" />
                        <span className="text-xs text-gray-500">{milestone.progress}% complete</span>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      {milestone.completedDate && (
                        <span>Completed: {milestone.completedDate.toLocaleDateString()}</span>
                      )}
                      {milestone.estimatedDate && (
                        <span>Estimated: {milestone.estimatedDate.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Photos */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Camera className="h-6 w-6 text-lush-primary" />
              Progress Photos
            </CardTitle>
            <p className="text-gray-600">Latest construction progress images</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {progressPhotos.map((photo) => (
                <div key={photo.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="aspect-video bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-500" />
                    <span className="ml-2 text-gray-500">Photo: {photo.stage}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{photo.stage}</h4>
                  <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                  <p className="text-xs text-gray-500">Uploaded: {photo.uploadedDate.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Requests */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <TrendingUp className="h-6 w-6 text-lush-primary" />
              Upgrade Requests
            </CardTitle>
            <p className="text-gray-600">Request changes or upgrades to your project</p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Available Upgrades:</strong> Kitchen benchtop upgrade, bathroom fixtures, flooring options
              </p>
            </div>
            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full md:w-auto bg-lush-primary hover:bg-lush-primary/90 text-white font-bold rounded-xl shadow-md py-3 px-8"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Request Upgrade
            </Button>
          </CardContent>
        </Card>

        {/* Communication */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <MessageSquare className="h-6 w-6 text-lush-primary" />
              Contact Your Team
            </CardTitle>
            <p className="text-gray-600">Get in touch with your project team</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-3 p-4 h-auto border-2 border-lush-primary text-lush-primary hover:bg-lush-primary hover:text-white"
              >
                <Phone className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Call Project Manager</div>
                  <div className="text-sm opacity-80">Mike Johnson - Builder</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-3 p-4 h-auto border-2 border-lush-primary text-lush-primary hover:bg-lush-primary hover:text-white"
              >
                <Mail className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Email Support</div>
                  <div className="text-sm opacity-80">Get updates & assistance</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <FileText className="h-6 w-6 text-lush-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Foundation milestone completed</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Camera className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">New progress photos uploaded</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Framing work commenced</p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Spacing */}
        <div className="pb-6"></div>
      </div>
    </div>
  );
};

export default PolishedClientPortal;