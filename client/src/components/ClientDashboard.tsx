import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CameraUpload from './CameraUpload';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  Calendar,
  Camera,
  MessageCircle,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock client project data
  const projectData = {
    address: "56 Inge King Crescent, Scullin ACT 2614",
    stage: "Framing",
    progress: 65,
    startDate: "December 2024",
    expectedCompletion: "September 2025",
    contractValue: 485000,
    nextMilestone: "Roofing Installation",
    nextMilestoneDate: "February 15, 2025"
  };

  const progressPhotos = [
    { id: 1, stage: "Foundation", date: "Dec 15, 2024", count: 8 },
    { id: 2, stage: "Framing", date: "Jan 20, 2025", count: 12 },
    { id: 3, stage: "Roofing", date: "Expected Feb 15", count: 0 }
  ];

  const upgradeRequests = [
    {
      id: 1,
      title: "Kitchen Benchtop Upgrade",
      description: "Caesar Stone benchtop upgrade",
      status: "quoted",
      amount: 3200,
      requestDate: "Jan 18, 2025"
    },
    {
      id: 2,
      title: "Bathroom Tile Upgrade",
      description: "Premium porcelain tile selection",
      status: "pending",
      amount: 1800,
      requestDate: "Jan 20, 2025"
    }
  ];

  const recentUpdates = [
    {
      id: 1,
      type: "progress",
      title: "Framing 75% Complete",
      message: "Wall framing on track for February completion",
      date: "2 hours ago",
      icon: <Home className="h-4 w-4" />
    },
    {
      id: 2,
      type: "photo",
      title: "New Progress Photos",
      message: "12 new photos uploaded from framing stage",
      date: "1 day ago",
      icon: <Camera className="h-4 w-4" />
    },
    {
      id: 3,
      type: "upgrade",
      title: "Kitchen Upgrade Quoted",
      message: "Your benchtop upgrade request has been quoted at $3,200",
      date: "2 days ago",
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Project</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {projectData.address}
          </p>
        </div>
        <Badge className="bg-lush-primary text-white">
          {projectData.stage} Phase
        </Badge>
      </div>

      {/* Mobile Camera Upload for Client Upgrade Requests */}
      <CameraUpload 
        uploadType="document" 
        onUpload={(file) => {
          console.log('Client uploaded file:', file.name);
          // Handle upgrade request documentation
        }}
      />

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-lush-primary" />
            Build Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900">{projectData.progress}%</span>
            </div>
            <Progress value={projectData.progress} className="h-3" />
            
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-6">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-900">Started</div>
                <div className="text-xs text-blue-700">{projectData.startDate}</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-900">Next Milestone</div>
                <div className="text-xs text-green-700">{projectData.nextMilestone}</div>
                <div className="text-xs text-green-600">{projectData.nextMilestoneDate}</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-900">Completion</div>
                <div className="text-xs text-purple-700">{projectData.expectedCompletion}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <Home className="h-4 w-4" /> },
            { id: 'photos', label: 'Progress Photos', icon: <Camera className="h-4 w-4" /> },
            { id: 'upgrades', label: 'Upgrade Requests', icon: <TrendingUp className="h-4 w-4" /> },
            { id: 'updates', label: 'Recent Updates', icon: <MessageCircle className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap min-h-[48px] ${
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
                <FileText className="h-5 w-5 text-lush-primary" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Contract Value:</span>
                <span className="font-semibold">${projectData.contractValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Stage:</span>
                <span className="font-semibold">{projectData.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-semibold">{projectData.progress}% Complete</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Completion:</span>
                <span className="font-semibold">{projectData.expectedCompletion}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-lush-primary" />
                Contact Your Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Site Manager: Mike Johnson
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Project Team
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Assistant Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="space-y-4">
          {progressPhotos.map((photoSet) => (
            <Card key={photoSet.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{photoSet.stage}</h3>
                    <p className="text-sm text-gray-600">{photoSet.date}</p>
                  </div>
                  <Badge variant={photoSet.count > 0 ? "default" : "secondary"}>
                    {photoSet.count} photos
                  </Badge>
                </div>
                
                {photoSet.count > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: Math.min(photoSet.count, 4) }).map((_, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Photos will be uploaded when this stage begins</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'upgrades' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Upgrade Requests</h3>
            <Button className="bg-lush-primary hover:bg-lush-primary/90">
              <TrendingUp className="h-4 w-4 mr-2" />
              Request New Upgrade
            </Button>
          </div>
          
          {upgradeRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.title}</h4>
                    <p className="text-sm text-gray-600">{request.description}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Requested: {request.requestDate}</span>
                  <span className="font-semibold flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    ${request.amount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="space-y-4">
          {recentUpdates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lush-primary/10 rounded-full flex items-center justify-center">
                    {update.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{update.title}</h4>
                    <p className="text-gray-600 mb-2">{update.message}</p>
                    <span className="text-xs text-gray-500">{update.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;