import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building,
  DollarSign,
  Calendar,
  Users,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Bell,
  FileText
} from 'lucide-react';

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: (projectData: any) => void;
}

const AdminProjectModal = ({ isOpen, onClose, onCreateProject }: AdminProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalBudget: '',
    estimatedROI: '',
    expectedStartDate: '',
    fundingStatus: 'no_funding',
    projectPackFile: null,
    stage: 'planning',
    description: '',
    alertInvestors: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fundingOptions = [
    { 
      value: 'no_funding', 
      label: 'No Funding Needed', 
      description: 'Client pre-funded project',
      icon: '💰'
    },
    { 
      value: 'open_to_funding', 
      label: 'Open to Investor Funding', 
      description: 'Seeking investor partners',
      icon: '📈'
    },
    { 
      value: 'investor_funded', 
      label: 'Investor Funded', 
      description: 'Already secured investor funding',
      icon: '✅'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.address) {
        throw new Error('Project name and address are required');
      }

      if (formData.fundingStatus === 'open_to_funding') {
        if (!formData.totalBudget || !formData.estimatedROI || !formData.expectedStartDate) {
          throw new Error('Budget, ROI, and start date are required for investor funding');
        }
      }

      // Generate project ID
      const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      const projectData = {
        ...formData,
        id: projectId,
        createdBy: 'admin@lush.com',
        createdAt: new Date().toISOString(),
        status: 'planning'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store project (in real app, this would be sent to backend)
      const existingProjects = JSON.parse(localStorage.getItem('lush_projects') || '[]');
      existingProjects.push(projectData);
      localStorage.setItem('lush_projects', JSON.stringify(existingProjects));

      // If open to funding and alert investors is checked, trigger investor alerts
      if (formData.fundingStatus === 'open_to_funding' && formData.alertInvestors) {
        // Simulate investor alert system
        const investorAlert = {
          projectId: projectId,
          alertType: 'new_opportunity',
          message: `New investment opportunity: ${formData.name}`,
          sentAt: new Date().toISOString(),
          recipients: ['investor@lush.com'] // Would fetch from database in real app
        };
        
        const existingAlerts = JSON.parse(localStorage.getItem('lush_investor_alerts') || '[]');
        existingAlerts.push(investorAlert);
        localStorage.setItem('lush_investor_alerts', JSON.stringify(existingAlerts));
      }

      setSuccess(`Project "${formData.name}" created successfully! ${formData.alertInvestors ? 'Investor alerts have been sent.' : ''}`);
      
      // Call parent callback if provided
      if (onCreateProject) {
        onCreateProject(projectData);
      }

      // Reset form
      setFormData({
        name: '',
        address: '',
        totalBudget: '',
        estimatedROI: '',
        expectedStartDate: '',
        fundingStatus: 'no_funding',
        projectPackFile: null,
        stage: 'planning',
        description: '',
        alertInvestors: false
      });

    } catch (err: any) {
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFundingIcon = (status: string) => {
    const option = fundingOptions.find(opt => opt.value === status);
    return option?.icon || '📋';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lush-primary rounded-xl flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Create New Project
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Set up a new project with funding preferences
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Address *
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full project address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lush-primary focus:border-transparent"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the project..."
                />
              </div>
            </div>

            {/* Funding Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Funding Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Status *
                </label>
                <Select 
                  value={formData.fundingStatus} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fundingStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select funding status" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Show investor fields if funding is open */}
              {formData.fundingStatus === 'open_to_funding' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
                  <h4 className="font-medium text-blue-900">Investor Funding Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Total Budget *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          value={formData.totalBudget}
                          onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: e.target.value }))}
                          placeholder="3,200,000"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Estimated ROI *
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.estimatedROI}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedROI: e.target.value }))}
                        placeholder="25.5"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Expected Start Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={formData.expectedStartDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, expectedStartDate: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Pack Upload */}
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Project Pack (Optional)
                    </label>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-blue-600">Click to upload project pack PDF</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFormData(prev => ({ ...prev, projectPackFile: e.target.files?.[0] || null }))}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Investor Alert Checkbox */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="alertInvestors"
                      checked={formData.alertInvestors}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, alertInvestors: !!checked }))}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="alertInvestors"
                        className="text-sm font-medium text-blue-900 cursor-pointer"
                      >
                        Alert Eligible Investors
                      </label>
                      <p className="text-xs text-blue-700">
                        Send immediate email and WhatsApp notifications to qualified investors about this opportunity
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Project Stage */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Initial Status</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Stage
                </label>
                <Select 
                  value={formData.stage} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select initial stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="pre_construction">Pre-Construction</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="framing">Framing</SelectItem>
                    <SelectItem value="roofing">Roofing</SelectItem>
                    <SelectItem value="lockup">Lockup</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Alert Preview */}
            {formData.fundingStatus === 'open_to_funding' && formData.alertInvestors && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Investor Alert Preview
                </h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div>📧 Email: New investment opportunity available</div>
                  <div>📱 WhatsApp: Exclusive funding opportunity alert</div>
                  <div>📍 Project: {formData.name || 'New Project'}</div>
                  <div>💰 Budget: ${formData.totalBudget || 'TBD'}</div>
                  <div>📈 ROI: {formData.estimatedROI || 'TBD'}%</div>
                  <div>👥 Recipients: All eligible investors</div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-lush-primary hover:bg-lush-primary/90"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Project...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Create Project
                    {formData.alertInvestors && <Bell className="h-4 w-4" />}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProjectModal;