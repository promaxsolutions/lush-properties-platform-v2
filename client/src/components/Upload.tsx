import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon } from "lucide-react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      alert(`Document uploaded successfully: ${file.name}`);
      setFile(null);
      setUploading(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-4"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {file && (
              <p className="text-sm text-gray-600 mb-4">
                Selected: {file.name}
              </p>
            )}
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            <p>Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;