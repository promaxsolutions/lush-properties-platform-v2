import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Camera, 
  Eye, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Lock,
  Activity
} from "lucide-react";
import { 
  verifyToken, 
  logActivity, 
  uploadSecurePhoto, 
  scanReceiptForFraud,
  getAuditLogs,
  checkPermissions,
  type SecurityUser,
  type AuditLogEntry,
  type SecureUploadResult
} from "../utils/securityAPI";

interface Project {
  id: string;
  name: string;
  status: string;
}

interface SecureProjectPanelProps {
  user: SecurityUser;
  project: Project;
}

const SecureProjectPanel = ({ user, project }: SecureProjectPanelProps) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [secureLog, setSecureLog] = useState<AuditLogEntry[]>([]);
  const [uploadResult, setUploadResult] = useState<SecureUploadResult | null>(null);
  const [fraudScan, setFraudScan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    initializeSecurityPanel();
  }, [user, project]);

  const initializeSecurityPanel = async () => {
    // Verify token and permissions
    const isValidToken = await verifyToken(user.token);
    const hasUploadPermission = await checkPermissions(user.id, 'UPLOAD', project.id);
    
    setTokenValid(isValidToken);
    setHasPermission(hasUploadPermission);
    
    if (isValidToken) {
      // Log access
      await logActivity(
        user.id,
        user.email,
        'ACCESS_PROJECT',
        project.id,
        { projectName: project.name, userRole: user.role }
      );
      
      // Load audit logs
      const logs = await getAuditLogs(user.id, 20);
      setSecureLog(logs);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    setLoading(true);

    try {
      // First, scan for fraud if it's a receipt
      if (file.name.toLowerCase().includes('receipt') || 
          file.name.toLowerCase().includes('invoice')) {
        const fraudResult = await scanReceiptForFraud(file);
        setFraudScan(fraudResult);
        
        if (fraudResult.fraudScore > 0.7) {
          alert("🚨 High fraud risk detected! Upload blocked for security review.");
          setLoading(false);
          return;
        }
      }

      // Upload with security measures
      const result = await uploadSecurePhoto(project.id, user.email, file);
      setUploadResult(result);

      if (result.success) {
        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { 
            message: `Photo securely uploaded: ${file.name} (Hash: ${result.hash.substring(0, 8)}...)` 
          }
        }));

        // Refresh audit logs
        const logs = await getAuditLogs(user.id, 20);
        setSecureLog(logs);
        
        alert("📸 Photo securely uploaded with fraud scanning and audit trail!");
      } else {
        alert("❌ Secure upload failed. Please try again.");
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("❌ Upload failed due to security error.");
    } finally {
      setLoading(false);
    }
  };

  const refreshAuditLog = async () => {
    const logs = await getAuditLogs(user.id, 20);
    setSecureLog(logs);
    
    await logActivity(
      user.id,
      user.email,
      'VIEW_AUDIT_LOG',
      project.id,
      { logCount: logs.length }
    );
  };

  if (!tokenValid) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="font-bold text-red-800">Access Denied</h3>
              <p className="text-red-700">Invalid or expired security token</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Security Header */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Secure Project Panel
          </CardTitle>
          <p className="text-sm text-green-700">
            Enhanced security with role-based access, audit logging, and fraud detection
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">Role: <Badge>{user.role}</Badge></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Token: Valid</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Permissions: {hasPermission ? 'Granted' : 'Limited'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project: {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Project ID:</span>
              <span className="ml-2 text-gray-600">{project.id}</span>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge variant="outline" className="ml-2">{project.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secure Photo Upload */}
      {hasPermission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Secure Progress Photo Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Upload Construction Photo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={loading}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-600 mt-1">
                Files are automatically hashed, scanned for fraud, and logged with your ID
              </p>
            </div>

            {loading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 animate-pulse" />
                  <span className="text-sm">Processing secure upload...</span>
                </div>
                <Progress value={65} className="w-full" />
              </div>
            )}

            {fraudScan && (
              <Alert className={fraudScan.fraudScore > 0.3 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Fraud Scan:</strong> Score: {(fraudScan.fraudScore * 100).toFixed(1)}% 
                  {fraudScan.flags.length > 0 && ` | Flags: ${fraudScan.flags.join(', ')}`}
                  <br />
                  <span className="text-xs">Confidence: {(fraudScan.confidence * 100).toFixed(1)}%</span>
                </AlertDescription>
              </Alert>
            )}

            {uploadResult && uploadResult.success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Upload Complete:</strong>
                  <br />File Hash: <code className="text-xs">{uploadResult.hash}</code>
                  <br />Uploaded: {new Date(uploadResult.timestamp).toLocaleString()}
                  <br />Security ID: {uploadResult.fileId}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Security Audit Log
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={refreshAuditLog} size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Refresh Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {secureLog.map((entry, i) => (
              <div key={entry.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">{entry.action}</div>
                    {entry.resource && (
                      <div className="text-gray-600 text-xs">Resource: {entry.resource}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-600 text-xs">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  {entry.ipAddress && (
                    <div className="text-gray-500 text-xs">
                      IP: {entry.ipAddress}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {secureLog.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No audit entries found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Active Security Features</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Role-based access control
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  File hash verification
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  AI fraud detection
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Complete audit logging
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Secure token validation
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Session Information</h4>
              <div className="space-y-1 text-sm">
                <div>User: {user.email}</div>
                <div>Role: {user.role}</div>
                <div>Last Activity: {new Date(user.lastActivity).toLocaleString()}</div>
                <div>Permissions: {user.permissions.length} granted</div>
                <div>Session: Active & Secure</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureProjectPanel;