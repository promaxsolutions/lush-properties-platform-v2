import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, FileImage, CheckCircle } from 'lucide-react';

interface CameraUploadProps {
  onUpload?: (file: File) => void;
  uploadType?: string;
  className?: string;
}

const CameraUpload: React.FC<CameraUploadProps> = ({ 
  onUpload, 
  uploadType = "document",
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    
    try {
      console.log(`[CAMERA-UPLOAD] Processing ${uploadType}:`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        timestamp: new Date().toISOString()
      });

      // Simulate upload processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onUpload) {
        onUpload(file);
      }
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => handleFileSelect(e as any);
    input.click();
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf,.doc,.docx';
    input.onchange = (e) => handleFileSelect(e as any);
    input.click();
  };

  return (
    <Card className={`md:hidden mb-4 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-lush-primary" />
            <span className="text-sm font-semibold text-gray-900">Mobile Upload</span>
          </div>
          {uploadSuccess && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">Uploaded!</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCameraCapture}
            disabled={uploading}
            className="flex-1 h-12 text-xs"
          >
            {uploading ? (
              <Upload className="h-4 w-4 animate-pulse mr-1" />
            ) : (
              <Camera className="h-4 w-4 mr-1" />
            )}
            {uploading ? 'Processing...' : 'Camera'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileUpload}
            disabled={uploading}
            className="flex-1 h-12 text-xs"
          >
            <FileImage className="h-4 w-4 mr-1" />
            Browse Files
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          {uploadType === 'receipt' && 'Capture receipts for expense tracking'}
          {uploadType === 'progress' && 'Document construction progress'}
          {uploadType === 'document' && 'Upload documents or photos'}
        </p>
      </CardContent>
    </Card>
  );
};

export default CameraUpload;