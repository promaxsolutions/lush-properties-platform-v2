import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  History, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Mail, 
  Eye,
  Download,
  RefreshCw
} from "lucide-react";

interface ClaimRecord {
  id: string;
  milestone: string;
  amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  followUpCount: number;
  attachments: string[];
  lenderResponse?: string;
}

const ClaimHistory = ({ projectId = "proj-001" }: { projectId?: string }) => {
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);

  // Sample data - in production, fetch from API
  const sampleClaims: ClaimRecord[] = [
    {
      id: "1",
      milestone: "Foundation Complete",
      amount: 85000,
      status: "approved",
      submittedAt: "2024-01-15",
      approvedAt: "2024-01-18", 
      followUpCount: 0,
      attachments: ["foundation_template.pdf", "foundation_photo.jpg"],
      lenderResponse: "Approved - Foundation work meets requirements"
    },
    {
      id: "2",
      milestone: "Frame Complete", 
      amount: 120000,
      status: "sent",
      submittedAt: "2024-02-10",
      followUpCount: 2,
      attachments: ["frame_template.pdf", "frame_photo.jpg", "timber_invoice.pdf"]
    },
    {
      id: "3",
      milestone: "Lockup Complete",
      amount: 95000,
      status: "draft",
      submittedAt: "2024-02-20",
      followUpCount: 0,
      attachments: ["lockup_template.pdf"]
    },
    {
      id: "4", 
      milestone: "Electrical Rough-in",
      amount: 45000,
      status: "rejected",
      submittedAt: "2024-01-30",
      followUpCount: 1,
      attachments: ["electrical_template.pdf", "electrical_photo.jpg"],
      lenderResponse: "Additional documentation required - please provide electrical inspection certificate"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClaims(sampleClaims);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'sent': return <Mail className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalClaimValue = claims
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);

  const pendingValue = claims
    .filter(c => c.status === 'sent')
    .reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading claim history...
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
            <History className="h-6 w-6" />
            Claims History & Management
          </CardTitle>
          <p className="text-sm text-gray-600">
            Track all progress claims, approvals, and follow-up communications
          </p>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${totalClaimValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Approved Claims</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${pendingValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Pending Claims</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {claims.filter(c => c.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {claims.filter(c => c.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(claim.status)}
                    <div>
                      <h4 className="font-semibold">{claim.milestone}</h4>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold">${claim.amount.toLocaleString()}</div>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Attachments: </span>
                    <span>{claim.attachments.length} files</span>
                  </div>
                  <div>
                    <span className="font-medium">Follow-ups: </span>
                    <span>{claim.followUpCount}</span>
                  </div>
                  <div>
                    {claim.approvedAt && (
                      <>
                        <span className="font-medium">Approved: </span>
                        <span>{new Date(claim.approvedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>

                {claim.lenderResponse && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                    <span className="font-medium">Lender Response: </span>
                    {claim.lenderResponse}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Files
                  </Button>
                  {claim.status === 'sent' && claim.followUpCount < 3 && (
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Follow-up
                    </Button>
                  )}
                </div>

                {/* Progress bar for follow-ups */}
                {claim.status === 'sent' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Follow-up Progress</span>
                      <span>{claim.followUpCount}/3</span>
                    </div>
                    <Progress 
                      value={(claim.followUpCount / 3) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Claims Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Claims Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims
              .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
              .map((claim, index) => (
                <div key={claim.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      claim.status === 'approved' ? 'bg-green-500' :
                      claim.status === 'rejected' ? 'bg-red-500' :
                      claim.status === 'sent' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    {index < claims.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{claim.milestone}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(claim.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ${claim.amount.toLocaleString()} • {claim.status}
                      {claim.followUpCount > 0 && ` • ${claim.followUpCount} follow-ups`}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimHistory;