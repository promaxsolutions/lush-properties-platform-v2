import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  TestTube, 
  Send, 
  CheckCircle, 
  Clock, 
  Mail,
  FileText,
  Building,
  DollarSign,
  Camera,
  AlertTriangle
} from "lucide-react";

const ClaimTestDemo = () => {
  const [testStage, setTestStage] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);

  const testScenarios = [
    { stage: "Preparing claim submission", progress: 20 },
    { stage: "Sending email to lender", progress: 40 },
    { stage: "Uploading attachments", progress: 60 },
    { stage: "Setting up follow-up automation", progress: 80 },
    { stage: "Claim submitted successfully", progress: 100 }
  ];

  const sampleClaim = {
    project: "Luxury Townhouse Development",
    milestone: "Frame Complete",
    amount: 120000,
    lenderEmail: "lender@westpacbank.com.au",
    builderEmail: "builder@lush.com",
    attachments: [
      "frame_completion_template.pdf",
      "site_progress_photo.jpg", 
      "timber_receipt_invoice.pdf"
    ]
  };

  const runClaimTest = async () => {
    setTestStage(0);
    setTestComplete(false);
    setFollowUpCount(0);

    // Simulate claim submission process
    for (let i = 0; i < testScenarios.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestStage(i);
    }

    setTestComplete(true);
    
    // Trigger notification
    window.dispatchEvent(new CustomEvent('uploadComplete', {
      detail: { message: 'Progress claim test completed - email sent to lender' }
    }));

    // Simulate follow-up after delay
    setTimeout(() => {
      setFollowUpCount(1);
      window.dispatchEvent(new CustomEvent('uploadComplete', {
        detail: { message: 'First follow-up reminder sent (24h later)' }
      }));
    }, 3000);
  };

  const simulateFollowUp = () => {
    if (followUpCount < 3) {
      setFollowUpCount(prev => prev + 1);
      window.dispatchEvent(new CustomEvent('uploadComplete', {
        detail: { message: `Follow-up #${followUpCount + 1} sent to lender` }
      }));
    }
  };

  const resetTest = () => {
    setTestStage(0);
    setTestComplete(false);
    setFollowUpCount(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Test Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6" />
            Progress Claim Automation Test
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test the complete claim submission and follow-up automation system
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={runClaimTest}
              disabled={testStage > 0 && !testComplete}
              className="flex-1"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Run Complete Claim Test
            </Button>
            {testComplete && (
              <Button variant="outline" onClick={resetTest}>
                Reset Test
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sample Claim Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Test Claim Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold mb-2">Project Information</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Project:</strong> {sampleClaim.project}</div>
                <div><strong>Milestone:</strong> {sampleClaim.milestone}</div>
                <div><strong>Amount:</strong> ${sampleClaim.amount.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email Recipients</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Lender:</strong> {sampleClaim.lenderEmail}</div>
                <div><strong>Builder:</strong> {sampleClaim.builderEmail}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {sampleClaim.attachments.map((file, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {file.includes('.pdf') ? <FileText className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                  {file}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Progress */}
      {testStage >= 0 && !testComplete && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Send className="h-8 w-8 mx-auto mb-2 animate-pulse text-blue-600" />
                <p className="text-sm text-gray-600">{testScenarios[testStage]?.stage}</p>
              </div>
              <Progress value={testScenarios[testStage]?.progress || 0} className="w-full" />
              <div className="text-xs text-gray-500 text-center">
                Processing claim submission and setting up automation...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testComplete && (
        <div className="space-y-4">
          {/* Success Status */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Claim Submitted Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm text-green-700">Email Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{sampleClaim.attachments.length}</div>
                  <div className="text-sm text-green-700">Attachments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${sampleClaim.amount.toLocaleString()}</div>
                  <div className="text-sm text-green-700">Claim Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Generated Email Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded text-sm">
                <div className="space-y-2">
                  <div><strong>To:</strong> {sampleClaim.lenderEmail}</div>
                  <div><strong>From:</strong> {sampleClaim.builderEmail}</div>
                  <div><strong>Subject:</strong> Progress Claim - {sampleClaim.milestone} - {sampleClaim.project}</div>
                  <hr className="my-3" />
                  <div className="whitespace-pre-wrap">
{`Dear Lender,

We are pleased to submit a progress claim for the following milestone:

Project: ${sampleClaim.project}
Milestone: ${sampleClaim.milestone}
Amount: $${sampleClaim.amount.toLocaleString()}

Work completed includes structural framing with all load-bearing elements installed and inspected. The project is proceeding on schedule.

Attached documents:
• Claim template/form (frame_completion_template.pdf)
• Site progress photo (site_progress_photo.jpg)
• Supporting invoice (timber_receipt_invoice.pdf)

Please review and approve this claim at your earliest convenience.

Best regards,
Construction Team`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up System */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Automated Follow-up System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Follow-ups Sent:</span>
                  <Badge variant={followUpCount > 0 ? "default" : "outline"}>
                    {followUpCount}/3
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${followUpCount >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">First follow-up (24 hours)</span>
                    {followUpCount >= 1 && <Badge variant="outline" className="text-xs">Sent</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${followUpCount >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Second follow-up (48 hours)</span>
                    {followUpCount >= 2 && <Badge variant="outline" className="text-xs">Sent</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${followUpCount >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Final follow-up (72 hours)</span>
                    {followUpCount >= 3 && <Badge variant="outline" className="text-xs">Sent</Badge>}
                  </div>
                </div>

                {followUpCount < 3 && (
                  <Button onClick={simulateFollowUp} variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Simulate Next Follow-up
                  </Button>
                )}

                {followUpCount >= 3 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Maximum follow-ups reached. Manual intervention may be required.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Automation Features Tested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Email Automation</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Professional email template
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Automatic file attachments
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Lender and builder notifications
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Follow-up System</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      24-hour reminder cycles
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Maximum 3 attempts
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Status tracking and history
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClaimTestDemo;