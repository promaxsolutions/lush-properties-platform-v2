import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Plus, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface UpgradeRequest {
  id: string;
  projectId: number;
  projectName: string;
  upgradeType: 'flooring' | 'kitchen' | 'bathroom' | 'lighting' | 'landscaping' | 'other';
  description: string;
  estimatedCost: number;
  status: 'pending' | 'quoted' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  quotedPrice?: number;
  adminNotes?: string;
}

const ClientUpgradePanel = () => {
  const [requests, setRequests] = useState<UpgradeRequest[]>([
    {
      id: 'upg_001',
      projectId: 1,
      projectName: '56 Inge King Crescent',
      upgradeType: 'kitchen',
      description: 'Upgrade to stone benchtops and premium appliances',
      estimatedCost: 15000,
      status: 'quoted',
      requestedAt: new Date('2024-07-15'),
      quotedPrice: 18500,
      adminNotes: 'Quote includes Caesarstone benchtops and Miele appliances'
    },
    {
      id: 'upg_002',
      projectId: 1,
      projectName: '56 Inge King Crescent',
      upgradeType: 'flooring',
      description: 'Upgrade from carpet to engineered timber flooring',
      estimatedCost: 8000,
      status: 'pending',
      requestedAt: new Date('2024-07-18')
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: 1,
    upgradeType: 'other',
    description: '',
    estimatedCost: ''
  });

  const upgradeTypes = [
    { value: 'flooring', label: '🏠 Flooring Upgrade', icon: '🪵' },
    { value: 'kitchen', label: '🍳 Kitchen Enhancement', icon: '🍳' },
    { value: 'bathroom', label: '🚿 Bathroom Upgrade', icon: '🛁' },
    { value: 'lighting', label: '💡 Lighting Package', icon: '💡' },
    { value: 'landscaping', label: '🌱 Landscaping', icon: '🌿' },
    { value: 'other', label: '🔧 Other Upgrade', icon: '⚙️' }
  ];

  const projects = [
    { id: 1, name: '56 Inge King Crescent' },
    { id: 2, name: 'Block 15 Section 87' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: UpgradeRequest = {
      id: `upg_${Date.now()}`,
      projectId: formData.projectId,
      projectName: projects.find(p => p.id === formData.projectId)?.name || '',
      upgradeType: formData.upgradeType as any,
      description: formData.description,
      estimatedCost: Number(formData.estimatedCost),
      status: 'pending',
      requestedAt: new Date()
    };

    setRequests(prev => [newRequest, ...prev]);
    setFormData({ projectId: 1, upgradeType: 'other', description: '', estimatedCost: '' });
    setShowForm(false);
    
    // Send notification
    alert('✅ Upgrade request submitted! Admin will review and provide a quote within 24 hours.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'quoted': return <DollarSign className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalPendingValue = requests
    .filter(r => r.status === 'pending' || r.status === 'quoted')
    .reduce((sum, r) => sum + (r.quotedPrice || r.estimatedCost), 0);

  const completedUpgrades = requests.filter(r => r.status === 'completed').length;
  const pendingQuotes = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Pending Value</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${totalPendingValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pending Quotes</p>
                <p className="text-2xl font-bold text-yellow-900">{pendingQuotes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{completedUpgrades}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Request Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              🧑‍💼 Client Upgrade Requests
            </span>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showForm && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project</label>
                  <select 
                    className="w-full border rounded-md p-2"
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: Number(e.target.value)})}
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upgrade Type</label>
                  <select 
                    className="w-full border rounded-md p-2"
                    value={formData.upgradeType}
                    onChange={(e) => setFormData({...formData, upgradeType: e.target.value})}
                  >
                    {upgradeTypes.map(type => (
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
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the upgrade you'd like to request..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Budget ($)</label>
                <input 
                  type="number"
                  className="w-full border rounded-md p-2"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                  placeholder="Your estimated budget for this upgrade"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Submit Request
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{request.projectName}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    {upgradeTypes.find(t => t.value === request.upgradeType)?.icon}
                    {upgradeTypes.find(t => t.value === request.upgradeType)?.label}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{request.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estimated Cost:</span> 
                  <span className="ml-1">${request.estimatedCost.toLocaleString()}</span>
                </div>
                {request.quotedPrice && (
                  <div>
                    <span className="font-medium">Quoted Price:</span> 
                    <span className="ml-1 font-semibold text-blue-600">
                      ${request.quotedPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Requested:</span> 
                  <span className="ml-1">{request.requestedAt.toLocaleDateString()}</span>
                </div>
              </div>

              {request.adminNotes && (
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes:</p>
                  <p className="text-sm text-blue-700">{request.adminNotes}</p>
                </div>
              )}

              {request.status === 'quoted' && (
                <div className="mt-3 flex gap-2">
                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setRequests(prev => prev.map(r => 
                        r.id === request.id ? {...r, status: 'approved'} : r
                      ));
                      alert('✅ Upgrade approved! Work will be scheduled.');
                    }}
                  >
                    Accept Quote
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRequests(prev => prev.map(r => 
                        r.id === request.id ? {...r, status: 'rejected'} : r
                      ));
                    }}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No upgrade requests yet
            </h3>
            <p className="text-gray-600 mb-4">
              Request upgrades to enhance your new home
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create First Request
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientUpgradePanel;