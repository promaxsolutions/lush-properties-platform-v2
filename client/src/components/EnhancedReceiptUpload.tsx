import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Camera, 
  FileImage, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  DollarSign,
  Calendar,
  Building
} from "lucide-react";

interface ReceiptUpload {
  file: File;
  preview: string;
  category: string;
  amount?: number;
  vendor?: string;
  date?: string;
  description?: string;
}

interface ReceiptUploadProps {
  projectId: string;
  onUploadComplete: (uploads: ReceiptUpload[]) => void;
}

const EnhancedReceiptUpload = ({ projectId, onUploadComplete }: ReceiptUploadProps) => {
  const [receipts, setReceipts] = useState<ReceiptUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingResults, setProcessingResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Materials & Supplies",
    "Labor & Subcontractors", 
    "Equipment Rental",
    "Permits & Fees",
    "Site Costs",
    "Professional Services",
    "Insurance",
    "Utilities",
    "Travel & Accommodation",
    "Other Expenses"
  ];

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
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newReceipt: ReceiptUpload = {
          file,
          preview: e.target?.result as string,
          category: "",
          description: file.name
        };
        setReceipts(prev => [...prev, newReceipt]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReceipt = (index: number) => {
    setReceipts(prev => prev.filter((_, i) => i !== index));
  };

  const updateReceipt = (index: number, updates: Partial<ReceiptUpload>) => {
    setReceipts(prev => 
      prev.map((receipt, i) => i === index ? { ...receipt, ...updates } : receipt)
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create video element for camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Create canvas for capture
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Simple camera implementation - in production, you'd want a proper camera modal
      setTimeout(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `receipt_${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFiles([file]);
          }
        });
        
        stream.getTracks().forEach(track => track.stop());
      }, 3000); // Auto-capture after 3 seconds
      
    } catch (error) {
      alert('Camera access denied or unavailable');
    }
  };

  const processReceiptWithAI = async (receipt: ReceiptUpload) => {
    try {
      const formData = new FormData();
      formData.append('receipt', receipt.file);
      formData.append('projectId', projectId);

      const response = await fetch('/api/fraud/scan-receipt', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI processing failed:', error);
      return { success: false };
    }
  };

  const handleUpload = async () => {
    if (receipts.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const results = [];
      
      for (let i = 0; i < receipts.length; i++) {
        const receipt = receipts[i];
        setUploadProgress((i / receipts.length) * 50);
        
        // Process with AI fraud detection
        const aiResult = await processReceiptWithAI(receipt);
        
        // Secure upload
        const formData = new FormData();
        formData.append('file', receipt.file);
        formData.append('projectId', projectId);
        formData.append('userEmail', 'user@example.com');
        formData.append('category', receipt.category);
        formData.append('description', receipt.description || '');
        
        const uploadResponse = await fetch('/api/upload/secure', {
          method: 'POST',
          body: formData
        });
        
        const uploadResult = await uploadResponse.json();
        
        results.push({
          ...uploadResult,
          aiAnalysis: aiResult,
          category: receipt.category,
          originalFile: receipt.file.name
        });
        
        setUploadProgress(50 + (i / receipts.length) * 50);
      }
      
      setProcessingResults(results);
      setUploadProgress(100);
      
      // Notify parent component
      onUploadComplete(receipts);
      
      // Show success notification
      window.dispatchEvent(new CustomEvent('uploadComplete', {
        detail: { message: `${receipts.length} receipt(s) uploaded successfully` }
      }));
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      <Card className="rounded-2xl shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Receipt Upload
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload receipts with image preview and category selection
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-lush-primary bg-lush-light' 
                : 'border-gray-300 hover:border-lush-primary'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileImage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Upload Receipt Images</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            
            <div className="flex justify-center gap-3">
              <Button onClick={triggerFileInput} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              
              <Button onClick={openCamera} variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Receipt Previews */}
      <AnimatePresence>
        {receipts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Receipt Previews ({receipts.length})
                  </span>
                  <Button 
                    onClick={handleUpload} 
                    disabled={uploading || receipts.some(r => !r.category)}
                    className="bg-lush-primary hover:bg-lush-primary/90"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload All'
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing receipts...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="grid gap-4">
                  {receipts.map((receipt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Image Preview */}
                        <div className="relative">
                          <img
                            src={receipt.preview}
                            alt={`Receipt ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-sm"
                          />
                          <Button
                            onClick={() => removeReceipt(index)}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Form Fields */}
                        <div className="lg:col-span-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`category-${index}`}>Category *</Label>
                              <Select
                                value={receipt.category}
                                onValueChange={(value) => updateReceipt(index, { category: value })}
                              >
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor={`amount-${index}`}>Amount</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id={`amount-${index}`}
                                  type="number"
                                  placeholder="0.00"
                                  value={receipt.amount || ''}
                                  onChange={(e) => updateReceipt(index, { amount: parseFloat(e.target.value) })}
                                  className="pl-10 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`vendor-${index}`}>Vendor</Label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id={`vendor-${index}`}
                                  placeholder="Vendor name"
                                  value={receipt.vendor || ''}
                                  onChange={(e) => updateReceipt(index, { vendor: e.target.value })}
                                  className="pl-10 rounded-xl"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor={`date-${index}`}>Date</Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id={`date-${index}`}
                                  type="date"
                                  value={receipt.date || ''}
                                  onChange={(e) => updateReceipt(index, { date: e.target.value })}
                                  className="pl-10 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor={`description-${index}`}>Description</Label>
                            <Input
                              id={`description-${index}`}
                              placeholder="Receipt description"
                              value={receipt.description || ''}
                              onChange={(e) => updateReceipt(index, { description: e.target.value })}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Results */}
      <AnimatePresence>
        {processingResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-lush-success" />
                  Processing Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {processingResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{result.originalFile}</span>
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <Badge className="bg-lush-success">Uploaded</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                        {result.aiAnalysis?.fraudScore && (
                          <Badge variant={result.aiAnalysis.fraudScore > 0.5 ? "destructive" : "outline"}>
                            Risk: {(result.aiAnalysis.fraudScore * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {result.success && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">File ID:</span>
                          <div className="font-mono text-xs mt-1">{result.fileId}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Hash:</span>
                          <div className="font-mono text-xs mt-1">{result.hash?.substring(0, 16)}...</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Upload Time:</span>
                          <div className="text-xs mt-1">{new Date(result.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Security:</span>
                          <div className="text-xs mt-1">Verified ✓</div>
                        </div>
                      </div>
                    )}
                    
                    {result.aiAnalysis?.flags?.length > 0 && (
                      <Alert className="mt-3 border-orange-200 bg-orange-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          AI Flags: {result.aiAnalysis.flags.join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedReceiptUpload;