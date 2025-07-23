import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CameraUpload from './CameraUpload';
import { 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Plus,
  Info,
  Building,
  Image,
  Hammer,
  DollarSign
} from 'lucide-react';

interface BuilderSubmission {
  id: string;
  projectId: number;
  projectName: string;
  submissionType: 'progress_photos' | 'invoice' | 'variation' | 'completion_cert';
  description: string;
  files: string[];
  amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'requires_info';
  submittedAt: Date;
  adminComments?: string;
}

const PolishedBuilderPortal = () => {
  // Get current user role
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("lush_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();
  const userRole = user?.role || 'builder';

  // Get time-based greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Get current date and time with timezone
  const getCurrentDateTime = () => {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZoneName: 'short'
    };
    return now.toLocaleDateString(undefined, options);
  };

  const [submissions, setSubmissions] = useState<BuilderSubmission[]>([
    {
      id: 'sub_001',
      projectId: 1,
      projectName: '56 Inge King Crescent',
      submissionType: 'progress_photos',
      description: 'Framing stage completion photos',
      files: ['framing_exterior.jpg', 'framing_interior.jpg'],
      status: 'approved',
      submittedAt: new Date('2024-07-18'),
      adminComments: 'Excellent progress. Approved for next payment.'
    },
    {
      id: 'sub_002',
      projectId: 1,
      projectName: '56 Inge King Crescent',
      submissionType: 'invoice',
      description: 'Plumbing rough-in invoice',
      files: ['plumbing_invoice.pdf'],
      amount: 12500,
      status: 'pending',
      submittedAt: new Date('2024-07-19')
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<number>(1);
  const [submissionType, setSubmissionType] = useState<string>('progress_photos');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  const projects = [
    { id: 1, name: '56 Inge King Crescent', stage: 'Framing' },
    { id: 2, name: 'Block 15 Section 87', stage: 'Slab' }
  ];

  const submissionTypes = [
    { value: 'progress_photos', label: '📸 Progress Photos', requiresAmount: false },
    { value: 'invoice', label: '💰 Invoice/Payment Request', requiresAmount: true },
    { value: 'variation', label: '📋 Variation Request', requiresAmount: true },
    { value: 'completion_cert', label: '✅ Completion Certificate', requiresAmount: false }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSubmission: BuilderSubmission = {
      id: `sub_${Date.now()}`,
      projectId: selectedProject,
      projectName: projects.find(p => p.id === selectedProject)?.name || '',
      submissionType: submissionType as any,
      description,
      files: files ? Array.from(files).map(f => f.name) : [],
      amount: amount || undefined,
      status: 'pending',
      submittedAt: new Date()
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    
    // Reset form
    setDescription('');
    setAmount(null);
    setFiles(null);
    
    // Show notification
    alert('✅ Submission sent successfully! Admin will review and approve.');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'requires_info': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requires_info': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const totalAmount = submissions.filter(s => s.status === 'approved' && s.amount).reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Beautiful Welcome Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-3 rounded-lg border border-green-100">
              <div className="text-xl font-semibold text-gray-800">
                Good {getTimeOfDay()}, {userRole === 'admin' ? 'Alex' : 
                                        userRole === 'builder' ? 'Mike' :
                                        userRole === 'client' ? 'Jennifer' :
                                        userRole === 'investor' ? 'David' :
                                        userRole === 'accountant' ? 'Emma' : 'User'}! 👋
              </div>
              <div className="text-sm text-gray-600 mt-1">{getCurrentDateTime()}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#007144] rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {userRole === 'admin' ? 'A' : 
                   userRole === 'builder' ? 'M' :
                   userRole === 'client' ? 'J' :
                   userRole === 'investor' ? 'D' :
                   userRole === 'accountant' ? 'E' : 'U'}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Builder Portal</div>
                <div className="text-xs text-gray-500">Project Submissions</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-lush-primary rounded-xl">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Lush Properties Pty Ltd — Builder Portal
              </h1>
              <p className="text-gray-600 mt-1">
                Submit progress photos, invoices, and project updates
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Mobile Camera Upload */}
        <CameraUpload 
          uploadType="progress" 
          onUpload={(file) => {
            console.log('Builder uploaded file:', file.name);
            // Handle file upload logic here
          }}
        />

        {/* Onboarding Tip */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Tip:</strong> Upload clear stage photos for faster approvals. Include wide shots and detail work for best results.
          </AlertDescription>
        </Alert>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium">Pending Approvals</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{pendingCount}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Payments</p>
                  <p className="text-2xl font-bold text-purple-900">${totalAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Active Projects</p>
                  <p className="text-2xl font-bold text-orange-900">{projects.length}</p>
                </div>
                <Building className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Build Photos Section */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Camera className="h-6 w-6 text-lush-primary" />
              📸 Upload Build Photos
            </CardTitle>
            <p className="text-gray-600">Upload progress photos to track construction milestones</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(Number(e.target.value))}
                  className="w-full border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:border-lush-primary focus:ring-lush-primary"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Type</label>
                <select
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value)}
                  className="w-full border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:border-lush-primary focus:ring-lush-primary"
                >
                  {submissionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work completed or invoice details..."
                rows={3}
                className="w-full border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:border-lush-primary focus:ring-lush-primary"
              />
            </div>

            {submissionTypes.find(t => t.value === submissionType)?.requiresAmount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                <Input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:border-lush-primary focus:ring-lush-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-lush-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Click to upload files or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">Images, PDFs up to 10MB each</p>
                </label>
              </div>
              {files && files.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600">{files.length} file(s) selected:</p>
                  <ul className="text-sm text-gray-800 mt-1">
                    {Array.from(files).map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full md:w-auto bg-lush-primary hover:bg-lush-primary/90 text-white font-bold rounded-xl shadow-md py-3 px-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Submit for Approval
            </Button>
          </CardContent>
        </Card>

        {/* Update Progress Section */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Clock className="h-6 w-6 text-lush-primary" />
              🕒 Update Progress
            </CardTitle>
            <p className="text-gray-600">Update project timeline and milestone progress</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">Current Stage: {project.stage}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Foundation</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Framing</span>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Roofing</span>
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-lush-primary text-lush-primary hover:bg-lush-primary hover:text-white"
                  >
                    Update Progress
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Claim Section */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FileText className="h-6 w-6 text-lush-primary" />
              🧾 Submit Claim
            </CardTitle>
            <p className="text-gray-600">Submit payment claims and invoices for review</p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Next Payment Due:</strong> Framing completion - Est. $45,000
              </p>
            </div>
            <Button
              className="w-full md:w-auto bg-lush-primary hover:bg-lush-primary/90 text-white font-bold rounded-xl shadow-md py-3 px-8"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Create New Claim
            </Button>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <FileText className="h-6 w-6 text-lush-primary" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map(submission => (
                <div key={submission.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(submission.status)}
                        <h4 className="font-semibold text-gray-900">{submission.description}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{submission.projectName}</p>
                      <p className="text-xs text-gray-500">{submission.submittedAt.toLocaleDateString()}</p>
                      {submission.amount && (
                        <p className="text-sm font-medium text-green-600">${submission.amount.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                  {submission.adminComments && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Admin Notes:</strong> {submission.adminComments}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Spacing */}
        <div className="pb-6"></div>
      </div>
    </div>
  );
};

export default PolishedBuilderPortal;