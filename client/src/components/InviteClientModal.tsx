import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus,
  Mail,
  Users,
  Calendar,
  Clock,
  Send,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface InviteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (inviteData: any) => void;
}

const InviteClientModal = ({ isOpen, onClose, onInvite }: InviteClientModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    projectId: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Mock projects for assignment
  const availableProjects = [
    {
      id: 'proj-001',
      name: 'Luxury Townhouse Development',
      address: '56 Inge King Crescent, Scullin ACT 2614'
    },
    {
      id: 'proj-002',
      name: 'Garden Apartments Complex',
      address: 'Block 15 Section 87, Canberra ACT'
    },
    {
      id: 'proj-003',
      name: 'Executive Residences',
      address: '789 Elm Drive, Brisbane QLD'
    }
  ];

  const userRoles = [
    { value: 'client', label: 'Client', description: 'Project tracking and updates' },
    { value: 'builder', label: 'Builder', description: 'Construction management' },
    { value: 'accountant', label: 'Accountant', description: 'Financial management' },
    { value: 'investor', label: 'Investor', description: 'Investment portfolio access' },
    { value: 'admin', label: 'Administrator', description: 'Full system access' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.role) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Generate invitation token (in real app, this would be done on backend)
      const inviteToken = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);

      const inviteData = {
        ...formData,
        token: inviteToken,
        expiresAt: expiryDate.toISOString(),
        invitedBy: 'admin@lush.com',
        invitedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store invitation (in real app, this would be sent to backend)
      const existingInvites = JSON.parse(localStorage.getItem('lush_invitations') || '[]');
      existingInvites.push(inviteData);
      localStorage.setItem('lush_invitations', JSON.stringify(existingInvites));

      setSuccess(`Invitation sent successfully to ${formData.firstName} ${formData.lastName}! They have 24 hours to accept.`);
      
      // Call parent callback if provided
      if (onInvite) {
        onInvite(inviteData);
      }

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        projectId: '',
        message: ''
      });

    } catch (err: any) {
      setError(err.message || 'Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'client': return '👤';
      case 'builder': return '🔨';
      case 'accountant': return '💰';
      case 'investor': return '📈';
      case 'admin': return '⚙️';
      default: return '👤';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lush-primary rounded-xl flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Invite Team Member
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Send a secure invitation to join your project
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
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Role & Access</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role *
                </label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getRoleIcon(role.value)}</span>
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-gray-500">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.role && formData.role !== 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Project {formData.role === 'investor' ? '(Optional)' : '*'}
                  </label>
                  <Select 
                    value={formData.projectId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.role === 'investor' && (
                        <SelectItem value="all">
                          <div>
                            <div className="font-medium">All Active Projects</div>
                            <div className="text-xs text-gray-500">Full portfolio access</div>
                          </div>
                        </SelectItem>
                      )}
                      {availableProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-xs text-gray-500">{project.address}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Custom Message */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Invitation Message</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lush-primary focus:border-transparent"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Add a personal welcome message..."
                />
              </div>
            </div>

            {/* Invitation Details */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Invitation Details
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Expires in 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>Secure magic link will be sent via email</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>User will be prompted to set up their account</span>
                </div>
              </div>
            </div>

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
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Invitation
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

export default InviteClientModal;