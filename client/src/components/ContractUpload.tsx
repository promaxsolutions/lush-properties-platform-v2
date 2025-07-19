import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Check, AlertCircle } from 'lucide-react';

interface ContractData {
  id: string;
  filename: string;
  extractedData: {
    contractValue: number;
    builderName: string;
    clientName: string;
    propertyAddress: string;
    startDate: string;
    completionDate: string;
    keyTerms: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
}

const ContractUpload = () => {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate PDF parsing and data extraction
      const mockExtractedData = {
        contractValue: Math.floor(Math.random() * 500000) + 200000,
        builderName: ["Meridian Homes", "Henley Properties", "McDonald Jones"][Math.floor(Math.random() * 3)],
        clientName: "John & Sarah Smith",
        propertyAddress: "Block 15 Section 87, Whitlam ACT 2611",
        startDate: "2024-08-01",
        completionDate: "2025-02-15",
        keyTerms: [
          "Fixed price contract",
          "7-star energy rating",
          "12-month warranty",
          "Progress payments aligned with stages"
        ]
      };

      const newContract: ContractData = {
        id: `contract_${Date.now()}_${i}`,
        filename: file.name,
        extractedData: mockExtractedData,
        status: 'pending',
        uploadedAt: new Date()
      };

      setContracts(prev => [newContract, ...prev]);
    }
    
    setUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const approveContract = (contractId: string) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId 
        ? { ...contract, status: 'approved' }
        : contract
    ));
  };

  const rejectContract = (contractId: string) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId 
        ? { ...contract, status: 'rejected' }
        : contract
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            📄 Contract Upload & Auto-Extraction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop contract files here
            </h3>
            <p className="text-gray-600 mb-4">
              Supports PDF, DOC, DOCX files up to 10MB
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={uploading}>
                {uploading ? 'Processing...' : 'Choose Files'}
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Contract List */}
      <div className="space-y-4">
        {contracts.map((contract) => (
          <Card key={contract.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{contract.filename}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Uploaded {contract.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {contract.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => approveContract(contract.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => rejectContract(contract.id)}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {contract.status === 'approved' && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      ✅ Approved
                    </span>
                  )}
                  {contract.status === 'rejected' && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      ❌ Rejected
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Contract Value</h4>
                  <p className="text-2xl font-bold text-green-600">
                    ${contract.extractedData.contractValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Builder</h4>
                  <p className="text-gray-700">{contract.extractedData.builderName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Client</h4>
                  <p className="text-gray-700">{contract.extractedData.clientName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Property Address</h4>
                  <p className="text-gray-700">{contract.extractedData.propertyAddress}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Start Date</h4>
                  <p className="text-gray-700">{contract.extractedData.startDate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Completion</h4>
                  <p className="text-gray-700">{contract.extractedData.completionDate}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Key Terms</h4>
                <div className="flex flex-wrap gap-2">
                  {contract.extractedData.keyTerms.map((term, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contracts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No contracts uploaded yet
            </h3>
            <p className="text-gray-600">
              Upload your first contract to get started with automatic data extraction
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractUpload;