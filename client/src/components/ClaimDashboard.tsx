import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  RefreshCw, 
  PenTool, 
  CheckCircle, 
  Clock, 
  Mail,
  DollarSign,
  Calendar,
  Building,
  Download,
  Eye
} from "lucide-react";

interface ClaimLog {
  id: string;
  milestone: string;
  amount: number;
  date: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'signed' | 'esign-pending';
  lenderEmail?: string;
  eSignatureStatus?: 'not-required' | 'pending' | 'sent' | 'signed' | 'expired';
  eSignatureDate?: string;
  followUpCount?: number;
  attachments?: string[];
}

interface Project {
  id: string;
  name: string;
  lenderEmail: string;
  builderEmail: string;
}

const ClaimDashboard = ({ project }: { project?: Project }) => {
  const [claimLogs, setClaimLogs] = useState<ClaimLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // Default project if none provided
  const defaultProject: Project = {
    id: "proj-001",
    name: "Luxury Townhouse Development",
    lenderEmail: "lender@westpacbank.com.au",
    builderEmail: "builder@lush.com"
  };

  const activeProject = project || defaultProject;

  // Sample claim logs
  const sampleClaimLogs: ClaimLog[] = [
    {
      id: "1",
      milestone: "Foundation Complete",
      amount: 85000,
      date: "2024-01-15",
      status: "signed",
      eSignatureStatus: "signed",
      eSignatureDate: "2024-01-18",
      followUpCount: 0,
      attachments: ["foundation_template.pdf", "foundation_photo.jpg"]
    },
    {
      id: "2",
      milestone: "Frame Complete", 
      amount: 120000,
      date: "2024-02-10",
      status: "approved",
      eSignatureStatus: "pending",
      followUpCount: 2,
      attachments: ["frame_template.pdf", "frame_photo.jpg", "timber_invoice.pdf"]
    },
    {
      id: "3",
      milestone: "Lockup Complete",
      amount: 95000,
      date: "2024-02-20",
      status: "sent",
      eSignatureStatus: "not-required",
      followUpCount: 1,
      attachments: ["lockup_template.pdf"]
    },
    {
      id: "4",
      milestone: "Roofing Complete",
      amount: 78000,
      date: "2024-03-05",
      status: "esign-pending",
      eSignatureStatus: "sent",
      followUpCount: 0,
      attachments: ["roofing_template.pdf", "roofing_photos.jpg"]
    }
  ];

  useEffect(() => {
    loadClaims();
  }, [activeProject.id, refresh]);

  const loadClaims = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClaimLogs(sampleClaimLogs);
    } catch (error) {
      console.error("Failed to load claim logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerESign = async (claimId: string) => {
    try {
      const claim = claimLogs.find(c => c.id === claimId);
      if (!claim) return;

      const response = await fetch('/api/claims/trigger-esignature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId,
          projectId: activeProject.id,
          milestone: claim.milestone,
          amount: claim.amount,
          lenderEmail: activeProject.lenderEmail,
          builderEmail: activeProject.builderEmail
        })
      });

      if (response.ok) {
        // Update local state
        setClaimLogs(prev => prev.map(c => 
          c.id === claimId 
            ? { ...c, eSignatureStatus: 'sent', status: 'esign-pending' }
            : c
        ));

        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { message: `E-signature request sent for ${claim.milestone}` }
        }));

        alert("🖊️ E-signature request sent to lender!");
      }
    } catch (error) {
      console.error("E-signature trigger error:", error);
      alert("❌ Failed to send e-signature request");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'signed': return 'bg-purple-100 text-purple-800';
      case 'esign-pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getESignStatusIcon = (status?: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent': case 'pending': return <PenTool className="h-4 w-4 text-orange-500" />;
      case 'expired': return <Clock className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const totalClaimsValue = claimLogs.reduce((sum, claim) => sum + claim.amount, 0);
  const approvedValue = claimLogs
    .filter(c => c.status === 'approved' || c.status === 'signed')
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingValue = claimLogs
    .filter(c => c.status === 'sent' || c.status === 'esign-pending')
    .reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading claim dashboard...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Progress Claims Dashboard
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete claim log with e-signature management for {activeProject.name}
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setRefresh(!refresh)} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Claims
          </Button>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">${totalClaimsValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Claims</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">${approvedValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Approved/Signed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">${pendingValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PenTool className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {claimLogs.filter(c => c.eSignatureStatus === 'signed').length}
                </div>
                <div className="text-sm text-gray-600">E-Signed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Complete Claims Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">Milestone</th>
                  <th className="text-left p-3 font-semibold">Amount</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">E-Signature</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claimLogs.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{claim.milestone}</div>
                      {claim.attachments && (
                        <div className="text-xs text-gray-500 mt-1">
                          {claim.attachments.length} attachments
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold">${claim.amount.toLocaleString()}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(claim.date).toLocaleDateString()}
                      </div>
                      {claim.eSignatureDate && (
                        <div className="text-xs text-purple-600 mt-1">
                          Signed: {new Date(claim.eSignatureDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status.toUpperCase()}
                      </Badge>
                      {claim.followUpCount && claim.followUpCount > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          {claim.followUpCount} follow-ups
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getESignStatusIcon(claim.eSignatureStatus)}
                        <span className="text-sm">
                          {claim.eSignatureStatus === 'signed' ? 'Signed' :
                           claim.eSignatureStatus === 'sent' ? 'Pending' :
                           claim.eSignatureStatus === 'pending' ? 'Pending' :
                           claim.eSignatureStatus === 'expired' ? 'Expired' : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {claim.status === "sent" && claim.eSignatureStatus !== 'sent' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTriggerESign(claim.id)}
                            className="text-xs"
                          >
                            <PenTool className="h-3 w-3 mr-1" />
                            Request E-Sign
                          </Button>
                        )}
                        
                        {claim.eSignatureStatus === 'signed' && (
                          <Badge variant="outline" className="text-green-600 text-xs">
                            ✅ Signed
                          </Badge>
                        )}

                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        
                        {claim.attachments && (
                          <Button size="sm" variant="outline" className="text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Files
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

      {/* E-Signature Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            E-Signature Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Signature Status</h4>
              <div className="space-y-2">
                {claimLogs.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{claim.milestone}</span>
                    <div className="flex items-center gap-2">
                      {getESignStatusIcon(claim.eSignatureStatus)}
                      <span className="text-xs">
                        {claim.eSignatureStatus === 'signed' ? 'Complete' :
                         claim.eSignatureStatus === 'sent' || claim.eSignatureStatus === 'pending' ? 'Awaiting' :
                         'Not Required'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Signature Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Claims:</span>
                  <Badge variant="outline">{claimLogs.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>E-Signed:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {claimLogs.filter(c => c.eSignatureStatus === 'signed').length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pending Signature:</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {claimLogs.filter(c => c.eSignatureStatus === 'sent' || c.eSignatureStatus === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate:</span>
                  <Badge variant="outline">
                    {Math.round((claimLogs.filter(c => c.eSignatureStatus === 'signed').length / claimLogs.length) * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent E-Signature Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claimLogs
              .filter(c => c.eSignatureStatus === 'signed' || c.eSignatureStatus === 'sent')
              .sort((a, b) => new Date(b.eSignatureDate || b.date).getTime() - new Date(a.eSignatureDate || a.date).getTime())
              .slice(0, 3)
              .map((claim) => (
                <Alert key={claim.id}>
                  {claim.eSignatureStatus === 'signed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <PenTool className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <strong>{claim.milestone}</strong> - 
                    {claim.eSignatureStatus === 'signed' ? 
                      ` E-signed on ${new Date(claim.eSignatureDate!).toLocaleDateString()}` :
                      ` E-signature request sent on ${new Date(claim.date).toLocaleDateString()}`
                    }
                  </AlertDescription>
                </Alert>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimDashboard;