import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Eye, 
  Filter,
  Calendar,
  Building2,
  DollarSign,
  Receipt,
  Users,
  Calculator,
  Search,
  FolderOpen,
  Shield,
  Clock
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'loan_contract' | 'sales_contract' | 'progress_claim' | 'receipt' | 'employment_contract' | 'tax_document';
  projectId?: string;
  projectName?: string;
  uploadDate: Date;
  fileSize: number;
  uploadedBy: string;
  accessLevel: 'view' | 'download' | 'restricted';
  category: string;
  description: string;
}

const AccountantDocumentCenter = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'doc_001',
        name: 'Construction Loan Agreement - Scullin Heights.pdf',
        type: 'loan_contract',
        projectId: 'proj_001',
        projectName: 'Scullin Heights Development',
        uploadDate: new Date('2024-12-15'),
        fileSize: 2048576,
        uploadedBy: 'admin@lush.com',
        accessLevel: 'download',
        category: 'Contracts',
        description: 'Primary construction loan documentation'
      },
      {
        id: 'doc_002',
        name: 'Sales Contract - Unit 3A Forrest.pdf',
        type: 'sales_contract',
        projectId: 'proj_002',
        projectName: 'Forrest Premium Townhouses',
        uploadDate: new Date('2025-01-10'),
        fileSize: 1536000,
        uploadedBy: 'broker@lush.com',
        accessLevel: 'download',
        category: 'Sales',
        description: 'Executed sales contract for Unit 3A'
      },
      {
        id: 'doc_003',
        name: 'Progress Claim #3 - Foundation Complete.pdf',
        type: 'progress_claim',
        projectId: 'proj_001',
        projectName: 'Scullin Heights Development',
        uploadDate: new Date('2025-01-15'),
        fileSize: 945120,
        uploadedBy: 'builder@lush.com',
        accessLevel: 'view',
        category: 'Claims',
        description: 'Foundation milestone claim submission'
      },
      {
        id: 'doc_004',
        name: 'Materials Receipt - Steel Framing.pdf',
        type: 'receipt',
        projectId: 'proj_001',
        projectName: 'Scullin Heights Development',
        uploadDate: new Date('2025-01-18'),
        fileSize: 256000,
        uploadedBy: 'builder@lush.com',
        accessLevel: 'download',
        category: 'Receipts',
        description: 'Steel framing materials purchase'
      },
      {
        id: 'doc_005',
        name: 'Site Foreman Employment Contract.pdf',
        type: 'employment_contract',
        projectId: undefined,
        projectName: 'Company Wide',
        uploadDate: new Date('2025-01-05'),
        fileSize: 512000,
        uploadedBy: 'hr@lush.com',
        accessLevel: 'view',
        category: 'HR',
        description: 'Employment agreement for site foreman position'
      },
      {
        id: 'doc_006',
        name: 'Q1 2025 BAS Preparation Documents.zip',
        type: 'tax_document',
        projectId: undefined,
        projectName: 'Tax Compliance',
        uploadDate: new Date('2025-01-20'),
        fileSize: 4096000,
        uploadedBy: 'accountant@lush.com',
        accessLevel: 'download',
        category: 'Tax',
        description: 'GST, BAS, and quarterly tax documentation'
      }
    ];

    setDocuments(mockDocuments);
    setFilteredDocs(mockDocuments);
  }, []);

  // Filter documents based on search and filters
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    if (projectFilter !== 'all') {
      filtered = filtered.filter(doc => doc.projectId === projectFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(doc => doc.uploadDate >= filterDate);
      }
    }

    setFilteredDocs(filtered);
  }, [documents, searchTerm, typeFilter, projectFilter, dateFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'loan_contract': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'sales_contract': return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'progress_claim': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'receipt': return <Receipt className="h-4 w-4 text-orange-600" />;
      case 'employment_contract': return <Users className="h-4 w-4 text-indigo-600" />;
      case 'tax_document': return <Calculator className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      loan_contract: 'bg-green-100 text-green-800',
      sales_contract: 'bg-blue-100 text-blue-800',
      progress_claim: 'bg-purple-100 text-purple-800',
      receipt: 'bg-orange-100 text-orange-800',
      employment_contract: 'bg-indigo-100 text-indigo-800',
      tax_document: 'bg-red-100 text-red-800'
    };

    const labels = {
      loan_contract: 'Loan Contract',
      sales_contract: 'Sales Contract',
      progress_claim: 'Progress Claim',
      receipt: 'Receipt',
      employment_contract: 'Employment',
      tax_document: 'Tax Document'
    };

    return (
      <Badge className={`text-xs ${colors[type as keyof typeof colors]}`}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDocumentView = (doc: Document) => {
    setSelectedDoc(doc);
    logAccess(doc.id, 'view');
  };

  const handleDocumentDownload = (doc: Document) => {
    // In real app, this would download the actual file
    alert(`Downloading: ${doc.name}`);
    logAccess(doc.id, 'download');
  };

  const logAccess = (docId: string, action: string) => {
    // Log access for audit trail
    console.log(`Accountant access logged: ${action} on document ${docId} at ${new Date().toISOString()}`);
  };

  const uniqueProjects = Array.from(new Set(documents.map(doc => doc.projectId).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-lush-primary rounded-xl">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  📚 Accounting Document Center
                </h1>
                <p className="text-gray-600 mt-1">
                  Secure access to contracts, claims, receipts, and tax documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Read-Only Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Document Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search Documents</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, project, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Document Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="loan_contract">Loan Contracts</SelectItem>
                    <SelectItem value="sales_contract">Sales Contracts</SelectItem>
                    <SelectItem value="progress_claim">Progress Claims</SelectItem>
                    <SelectItem value="receipt">Receipts</SelectItem>
                    <SelectItem value="employment_contract">Employment Contracts</SelectItem>
                    <SelectItem value="tax_document">Tax Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Project</label>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {uniqueProjects.map(projectId => {
                      const project = documents.find(doc => doc.projectId === projectId);
                      return (
                        <SelectItem key={projectId} value={projectId!}>
                          {project?.projectName}
                        </SelectItem>
                      );
                    })}
                    <SelectItem value="company">Company Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Upload Date</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Documents', value: filteredDocs.length, icon: FileText, color: 'blue' },
            { label: 'Loan Contracts', value: filteredDocs.filter(d => d.type === 'loan_contract').length, icon: DollarSign, color: 'green' },
            { label: 'Sales Contracts', value: filteredDocs.filter(d => d.type === 'sales_contract').length, icon: Building2, color: 'blue' },
            { label: 'Progress Claims', value: filteredDocs.filter(d => d.type === 'progress_claim').length, icon: FileText, color: 'purple' },
            { label: 'Receipts', value: filteredDocs.filter(d => d.type === 'receipt').length, icon: Receipt, color: 'orange' },
            { label: 'Tax Documents', value: filteredDocs.filter(d => d.type === 'tax_document').length, icon: Calculator, color: 'red' }
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Document Library ({filteredDocs.length} documents)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Document</th>
                    <th className="text-left p-4 font-medium text-gray-900">Type</th>
                    <th className="text-left p-4 font-medium text-gray-900">Project</th>
                    <th className="text-left p-4 font-medium text-gray-900">Upload Date</th>
                    <th className="text-left p-4 font-medium text-gray-900">Size</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(doc.type)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getTypeBadge(doc.type)}
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{doc.projectName}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {doc.uploadDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{formatFileSize(doc.fileSize)}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDocumentView(doc)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {doc.accessLevel === 'download' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDocumentDownload(doc)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Accountant Access Rights</h3>
                <p className="text-sm text-green-800 mt-1">
                  You have read-only access to all financial documents for tax preparation, BAS reporting, and payroll setup. 
                  All document access is logged for security audit purposes. You cannot edit or delete documents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountantDocumentCenter;