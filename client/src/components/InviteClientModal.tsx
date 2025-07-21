import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Home,
  Send,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface InviteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectOption {
  id: string;
  name: string;
  address: string;
  stage: string;
}

const InviteClientModal = ({ isOpen, onClose }: InviteClientModalProps) => {
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  // Mock project data - in real app, this would come from API
  const projects: ProjectOption[] = [
    { id: 'proj-001', name: '56 Inge King Crescent', address: '56 Inge King Crescent, Scullin ACT 2614', stage: 'Framing' },
    { id: 'proj-002', name: 'Block 15 Section 87', address: 'Block 15 Section 87, Gungahlin ACT 2912', stage: 'Foundation' },
    { id: 'proj-003', name: 'Luxury Townhouse Development', address: '123 Premium Street, Barton ACT 2600', stage: 'Planning' }
  ];

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success response
      setInviteSent(true);
      
      // Reset form after success
      setTimeout(() => {
        setInviteSent(false);
        setClientEmail('');
        setClientPhone('');
        setClientName('');
        setSelectedProject('');
        setPersonalMessage('');
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Failed to send invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (inviteSent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Invitation Sent!</h3>
            <p className="text-gray-600 mb-4">
              {clientName} will receive an email and SMS with their project access link.
            </p>
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
              The invite link will expire in 24 hours for security.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-lush-primary rounded-xl flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Invite Client to Project
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-600">
            Send a secure invitation link to give your client access to their project dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSendInvite} className="space-y-6">
            {/* Client Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-lush-primary" />
                Client Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Jennifer Williams"
                    required
                    className="rounded-xl border-gray-300 focus:border-lush-primary focus:ring-lush-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="jennifer@email.com"
                      required
                      className="pl-10 rounded-xl border-gray-300 focus:border-lush-primary focus:ring-lush-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+61 4XX XXX XXX"
                    className="pl-10 rounded-xl border-gray-300 focus:border-lush-primary focus:ring-lush-primary"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  SMS notifications for milestone updates (optional)
                </p>
              </div>
            </div>

            {/* Project Selection */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Home className="h-5 w-5 text-lush-primary" />
                Project Assignment
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Project *
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  required
                  className="w-full rounded-xl border-gray-300 focus:border-lush-primary focus:ring-lush-primary px-4 py-3"
                >
                  <option value="">Choose a project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.address}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProject && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  {(() => {
                    const project = projects.find(p => p.id === selectedProject);
                    return project ? (
                      <div>
                        <h5 className="font-medium text-blue-900 mb-1">{project.name}</h5>
                        <p className="text-sm text-blue-700 mb-1">{project.address}</p>
                        <p className="text-sm text-blue-600">Current Stage: {project.stage}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            {/* Personal Message */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-lush-primary" />
                Personal Message (Optional)
              </h4>

              <div>
                <Textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Hi Jennifer, welcome to your project dashboard! You can track progress, view photos, and stay updated on your build..."
                  rows={4}
                  className="rounded-xl border-gray-300 focus:border-lush-primary focus:ring-lush-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be included in the invitation email
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Security Notice:</strong> Invitation links expire after 24 hours. 
                The client will need to set up their password on first login.
              </AlertDescription>
            </Alert>

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
                disabled={isLoading || !clientEmail || !clientName || !selectedProject}
                className="flex-1 bg-lush-primary hover:bg-lush-primary/90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Invite...
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