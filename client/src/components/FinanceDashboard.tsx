import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AccountantDocumentCenter from './AccountantDocumentCenter';
import CameraUpload from './CameraUpload';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard,
  Receipt,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [xeroConnected, setXeroConnected] = useState(true);

  // Mock financial data
  const financialStats = {
    totalReceipts: 47,
    pendingClaims: 8,
    processedPayments: 125000,
    outstandingAmount: 23500
  };

  const recentReceipts = [
    {
      id: 1,
      vendor: "Building Supplies Co",
      amount: 2340.50,
      category: "Materials",
      date: "Jan 21, 2025",
      status: "processed",
      project: "56 Inge King Crescent"
    },
    {
      id: 2,
      vendor: "Concrete Solutions",
      amount: 4200.00,
      category: "Foundation",
      date: "Jan 20, 2025",
      status: "pending",
      project: "Block 15 Section 87"
    },
    {
      id: 3,
      vendor: "Electrical Systems",
      amount: 1875.25,
      category: "Electrical",
      date: "Jan 19, 2025",
      status: "processed",
      project: "56 Inge King Crescent"
    }
  ];

  const paymentClaims = [
    {
      id: 1,
      claimNumber: "CLM-2025-001",
      project: "56 Inge King Crescent",
      amount: 25000,
      status: "submitted",
      submittedDate: "Jan 20, 2025",
      dueDate: "Feb 3, 2025"
    },
    {
      id: 2,
      claimNumber: "CLM-2025-002",
      project: "Block 15 Section 87",
      amount: 18500,
      status: "approved",
      submittedDate: "Jan 15, 2025",
      dueDate: "Jan 29, 2025"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending':
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleXeroSync = async () => {
    // Simulate Xero sync
    console.log('Syncing with Xero...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600">Manage receipts, claims, and financial integration</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={xeroConnected ? "default" : "secondary"} className="bg-blue-600">
            Xero {xeroConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Button onClick={handleXeroSync} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Xero
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-gray-900">{financialStats.totalReceipts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                <p className="text-2xl font-bold text-gray-900">{financialStats.pendingClaims}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed Payments</p>
                <p className="text-2xl font-bold text-gray-900">${financialStats.processedPayments.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">${financialStats.outstandingAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Camera Upload for Accountant Receipt Processing */}
      <CameraUpload 
        uploadType="receipt" 
        onUpload={(file) => {
          console.log('Accountant uploaded receipt:', file.name);
          // Handle receipt processing
        }}
      />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Finance Overview', icon: <DollarSign className="h-4 w-4" /> },
            { id: 'receipts', label: 'Receipts', icon: <Receipt className="h-4 w-4" /> },
            { id: 'claims', label: 'Payment Claims', icon: <FileText className="h-4 w-4" /> },
            { id: 'documents', label: '📚 Accounting Docs', icon: <FileText className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Receipt Processed</p>
                    <p className="text-sm text-green-700">Building Supplies Co - $2,340.50</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Claim Submitted</p>
                    <p className="text-sm text-blue-700">CLM-2025-001 - $25,000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Xero Sync Pending</p>
                    <p className="text-sm text-yellow-700">3 receipts awaiting sync</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-lush-primary hover:bg-lush-primary/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Receipt
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create Payment Claim
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Financial Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync with Xero
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'receipts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Receipt Management</h3>
            <Button className="bg-lush-primary hover:bg-lush-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Upload Receipt
            </Button>
          </div>
          
          {recentReceipts.map((receipt) => (
            <Card key={receipt.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{receipt.vendor}</h4>
                      <Badge className={getStatusColor(receipt.status)}>
                        {receipt.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Amount:</span>
                        <p className="font-semibold text-gray-900">${receipt.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{receipt.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p>{receipt.date}</p>
                      </div>
                      <div>
                        <span className="font-medium">Project:</span>
                        <p>{receipt.project}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Payment Claims</h3>
            <Button className="bg-lush-primary hover:bg-lush-primary/90">
              <FileText className="h-4 w-4 mr-2" />
              Create New Claim
            </Button>
          </div>
          
          {paymentClaims.map((claim) => (
            <Card key={claim.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{claim.claimNumber}</h4>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Amount:</span>
                        <p className="font-semibold text-gray-900">${claim.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Project:</span>
                        <p>{claim.project}</p>
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p>{claim.submittedDate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due:</span>
                        <p>{claim.dueDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <AccountantDocumentCenter />
      )}

      {activeTab === 'xero' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Xero Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Xero Connection Status</h4>
                    <p className="text-sm text-blue-700">
                      {xeroConnected ? 'Connected and syncing automatically' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-sm">Sync Receipts to Xero</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Download className="h-5 w-5 mb-1" />
                  <span className="text-sm">Import from Xero</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="text-sm">View Sync Log</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <RefreshCw className="h-5 w-5 mb-1" />
                  <span className="text-sm">Manual Sync</span>
                </Button>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h5 className="font-medium text-yellow-900 mb-2">Sync Schedule</h5>
                <p className="text-sm text-yellow-800">
                  Automatic sync runs every 4 hours. Last sync: Today at 10:00 AM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinanceDashboard;