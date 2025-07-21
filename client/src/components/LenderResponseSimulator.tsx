import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Clock, 
  MessageSquare,
  Building
} from "lucide-react";

interface PendingClaim {
  id: string;
  milestone: string;
  amount: number;
  project: string;
  submittedAt: string;
  builderEmail: string;
  attachments: string[];
}

const LenderResponseSimulator = () => {
  const [selectedClaim, setSelectedClaim] = useState<PendingClaim | null>(null);
  const [response, setResponse] = useState("");
  const [responseType, setResponseType] = useState<'approve' | 'reject' | null>(null);

  const pendingClaims: PendingClaim[] = [
    {
      id: "2",
      milestone: "Frame Complete",
      amount: 120000,
      project: "Luxury Townhouse Development",
      submittedAt: "2024-02-10",
      builderEmail: "builder@lush.com",
      attachments: ["frame_template.pdf", "frame_photo.jpg", "timber_invoice.pdf"]
    },
    {
      id: "3", 
      milestone: "Lockup Complete",
      amount: 95000,
      project: "Modern Apartment Complex",
      submittedAt: "2024-02-20",
      builderEmail: "builder@lush.com",
      attachments: ["lockup_template.pdf", "lockup_photo.jpg"]
    }
  ];

  const handleResponse = async (action: 'approve' | 'reject') => {
    if (!selectedClaim) return;

    try {
      const responseData = {
        claimId: selectedClaim.id,
        action,
        response: response || (action === 'approve' ? 'Approved - All requirements met' : 'Additional documentation required'),
        lenderEmail: 'lender@westpacbank.com.au'
      };

      const apiResponse = await fetch('/api/claims/lender-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });

      if (apiResponse.ok) {
        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { 
            message: `Claim ${action === 'approve' ? 'approved' : 'rejected'} - Builder notified` 
          }
        }));

        // Reset form
        setSelectedClaim(null);
        setResponse("");
        setResponseType(null);
        
        alert(`✅ Claim ${action === 'approve' ? 'approved' : 'rejected'} and builder notified`);
      }
    } catch (error) {
      console.error('Lender response error:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            Lender Response Simulator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Simulate lender responses to test the complete claim workflow
          </p>
        </CardHeader>
      </Card>

      {/* Pending Claims */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Claims for Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingClaims.map((claim) => (
              <div 
                key={claim.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedClaim?.id === claim.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedClaim(claim)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{claim.milestone}</h4>
                    <p className="text-sm text-gray-600">{claim.project}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${claim.amount.toLocaleString()}</div>
                    <Badge variant="outline">Pending Review</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Submitted: </span>
                    {new Date(claim.submittedAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Builder: </span>
                    {claim.builderEmail}
                  </div>
                  <div>
                    <span className="font-medium">Attachments: </span>
                    {claim.attachments.length} files
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Form */}
      {selectedClaim && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Respond to Claim: {selectedClaim.milestone}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Claim Details:</strong> {selectedClaim.project} - {selectedClaim.milestone} - ${selectedClaim.amount.toLocaleString()}
              </AlertDescription>
            </Alert>

            <div>
              <label className="block font-medium mb-2">Response Message (Optional)</label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Add comments or requirements for the builder..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => handleResponse('approve')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Claim
              </Button>
              <Button 
                onClick={() => handleResponse('reject')}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Request Changes
              </Button>
            </div>

            <div className="text-xs text-gray-600">
              The builder will receive an automated email notification with your response.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Preview */}
      {selectedClaim && responseType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Preview - Builder Notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded text-sm">
              <div className="space-y-2">
                <div><strong>To:</strong> {selectedClaim.builderEmail}</div>
                <div><strong>From:</strong> lender@westpacbank.com.au</div>
                <div><strong>Subject:</strong> Claim {responseType === 'approve' ? 'Approved' : 'Requires Changes'} - {selectedClaim.milestone}</div>
                <hr className="my-3" />
                <div className="whitespace-pre-wrap">
{`Dear Builder,

Your progress claim has been ${responseType === 'approve' ? 'approved' : 'reviewed and requires changes'}.

Project: ${selectedClaim.project}
Milestone: ${selectedClaim.milestone}
Amount: $${selectedClaim.amount.toLocaleString()}

${response || (responseType === 'approve' 
  ? 'All documentation meets our requirements. Payment will be processed within 3-5 business days.' 
  : 'Please review the requirements and resubmit with the necessary documentation.')}

${responseType === 'approve' ? 'Thank you for your continued partnership.' : 'Please contact us if you have any questions.'}

Best regards,
Lending Team`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LenderResponseSimulator;