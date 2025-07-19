import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer, Upload, Camera, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

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

const BuilderPortal = () => {
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
    <div className="p-6 space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-blue-900">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Approved Submissions</p>
                <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Approved</p>
                <p className="text-2xl font-bold text-purple-900">${totalAmount.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Active Projects</p>
                <p className="text-2xl font-bold text-orange-900">{projects.length}</p>
              </div>
              <Hammer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Submission Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            🔧 Submit New Claim or Progress Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project</label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(Number(e.target.value))}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.stage})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Submission Type</label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value)}
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
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                className="w-full border rounded-md p-2"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work completed or invoice details..."
                required
              />
            </div>

            {submissionTypes.find(t => t.value === submissionType)?.requiresAmount && (
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input 
                  type="number"
                  className="w-full border rounded-md p-2"
                  value={amount || ''}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Enter invoice amount"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Upload Files</label>
              <input 
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={(e) => setFiles(e.target.files)}
                className="w-full border rounded-md p-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload photos, invoices, certificates, or other relevant documents
              </p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              📤 Submit for Admin Approval
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Submissions History */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Submission History & Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{submission.projectName}</h4>
                    <p className="text-sm text-gray-600">{submission.description}</p>
                    <p className="text-xs text-gray-500">
                      Submitted {submission.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(submission.status)}`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> 
                    {submissionTypes.find(t => t.value === submission.submissionType)?.label}
                  </div>
                  {submission.amount && (
                    <div>
                      <span className="font-medium">Amount:</span> ${submission.amount.toLocaleString()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Files:</span> {submission.files.length} file(s)
                  </div>
                </div>

                {submission.files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {submission.files.map((file, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {submission.adminComments && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">Admin Comments:</p>
                    <p className="text-sm text-blue-700">{submission.adminComments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuilderPortal;