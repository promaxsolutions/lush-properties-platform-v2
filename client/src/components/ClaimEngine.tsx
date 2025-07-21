import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Send, 
  Upload, 
  FileText, 
  Camera, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Mail,
  Building,
  Calendar
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  lenderEmail: string;
  builderEmail: string;
  stage: string;
  amount: number;
}

interface ClaimData {
  project: string;
  milestone: string;
  amount: number;
  lenderEmail: string;
  builderEmail: string;
  template?: File | null;
  receipt?: File | null;
  photo?: File | null;
  status: string;
  description?: string;
}

const ClaimEngine = ({ project }: { project?: Project }) => {
  const [milestone, setMilestone] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [template, setTemplate] = useState<File | null>(null);
  const [claimStatus, setClaimStatus] = useState("draft");
  const [submitting, setSubmitting] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [lastFollowUp, setLastFollowUp] = useState<Date | null>(null);

  // Sample project data if none provided
  const defaultProject: Project = {
    id: "proj-001",
    name: "Luxury Townhouse Development",
    lenderEmail: "lender@westpacbank.com.au",
    builderEmail: "builder@lush.com",
    stage: "Frame",
    amount: 450000
  };

  const activeProject = project || defaultProject;

  // Construction milestones
  const milestones = [
    "Foundation Complete",
    "Frame Complete", 
    "Lockup Complete",
    "Roofing Complete",
    "Plumbing Rough-in",
    "Electrical Rough-in",
    "Insulation Complete",
    "Drywall Complete",
    "Final Inspection",
    "Handover Complete"
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const handleSubmitClaim = async () => {
    setSubmitting(true);
    
    try {
      const claimData: ClaimData = {
        project: activeProject.name,
        milestone,
        amount: parseFloat(amount),
        lenderEmail: activeProject.lenderEmail,
        builderEmail: activeProject.builderEmail,
        template,
        receipt,
        photo,
        status: "sent",
        description
      };

      // Submit claim via API
      const response = await fetch('/api/claims/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...claimData,
          projectId: activeProject.id
        })
      });

      if (response.ok) {
        setClaimStatus("sent");
        
        // Trigger notification
        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { message: `Claim submitted for ${milestone} - $${amount}` }
        }));

        // Reset form
        setMilestone("");
        setAmount("");
        setDescription("");
        setReceipt(null);
        setPhoto(null);
        setTemplate(null);
        
        alert("📤 Claim submitted to lender successfully!");
      } else {
        throw new Error('Failed to submit claim');
      }
    } catch (error) {
      console.error('Claim submission error:', error);
      alert("❌ Failed to submit claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const checkFollowUp = async () => {
    try {
      const response = await fetch(`/api/claims/followup/${activeProject.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone, amount })
      });

      if (response.ok) {
        setFollowUpCount(prev => prev + 1);
        setLastFollowUp(new Date());
        
        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { message: `Follow-up sent for ${milestone} claim` }
        }));
      }
    } catch (error) {
      console.error('Follow-up error:', error);
    }
  };

  // Auto follow-up effect
  useEffect(() => {
    if (claimStatus === "sent" && followUpCount < 3) {
      const interval = setInterval(() => {
        checkFollowUp();
      }, 24 * 60 * 60 * 1000); // 24 hours

      return () => clearInterval(interval);
    }
  }, [claimStatus, followUpCount]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Progress Claim Automation Engine
          </CardTitle>
          <p className="text-sm text-gray-600">
            Automated progress claim submission with lender email integration and follow-up tracking
          </p>
        </CardHeader>
      </Card>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Project Name</Label>
              <p className="text-sm text-gray-600 mt-1">{activeProject.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Lender Email</Label>
              <p className="text-sm text-gray-600 mt-1">{activeProject.lenderEmail}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Current Stage</Label>
              <Badge variant="outline" className="mt-1">{activeProject.stage}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submit Progress Claim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Milestone Selection */}
          <div>
            <Label htmlFor="milestone">Construction Milestone</Label>
            <Select value={milestone} onValueChange={setMilestone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select milestone" />
              </SelectTrigger>
              <SelectContent>
                {milestones.map((ms) => (
                  <SelectItem key={ms} value={ms}>{ms}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Claim Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the work completed for this milestone..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Claim Template</Label>
              <div className="mt-1">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleUpload(e, setTemplate)}
                  className="text-sm"
                />
                {template && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {template.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Site Photo</Label>
              <div className="mt-1">
                <Input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleUpload(e, setPhoto)}
                  className="text-sm"
                />
                {photo && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {photo.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Receipt/Invoice</Label>
              <div className="mt-1">
                <Input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleUpload(e, setReceipt)}
                  className="text-sm"
                />
                {receipt && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {receipt.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmitClaim}
              disabled={submitting || !milestone || !amount}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit to Lender
                </>
              )}
            </Button>
            
            {claimStatus === "sent" && (
              <Button variant="outline" onClick={checkFollowUp}>
                <Mail className="h-4 w-4 mr-2" />
                Send Follow-up
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submission Progress */}
      {submitting && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Send className="h-8 w-8 mx-auto mb-2 animate-pulse text-blue-600" />
                <p className="text-sm text-gray-600">Submitting claim to lender...</p>
              </div>
              <Progress value={75} className="w-full" />
              <div className="text-xs text-gray-500 text-center">
                Preparing documents • Sending email • Updating records
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status and Follow-up Tracking */}
      {claimStatus !== "draft" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Claim Status & Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Current Status:</span>
                <Badge className={getStatusColor(claimStatus)}>
                  {claimStatus.toUpperCase()}
                </Badge>
              </div>

              {followUpCount > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Follow-ups Sent:</span>
                    <Badge variant="outline">{followUpCount}</Badge>
                  </div>
                  
                  {lastFollowUp && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Last Follow-up:</span>
                      <span>{lastFollowUp.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}

              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  {claimStatus === "sent" ? (
                    <>Auto follow-up enabled: System will send reminders every 24 hours (max 3 attempts)</>
                  ) : (
                    <>Claim tracking: Monitor status and automate follow-up communications</>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded text-sm">
            <div className="space-y-2">
              <div><strong>To:</strong> {activeProject.lenderEmail}</div>
              <div><strong>From:</strong> {activeProject.builderEmail}</div>
              <div><strong>Subject:</strong> Progress Claim - {milestone} - {activeProject.name}</div>
              <hr className="my-3" />
              <div className="whitespace-pre-wrap">
{`Dear Lender,

We are pleased to submit a progress claim for the following milestone:

Project: ${activeProject.name}
Milestone: ${milestone || '[Selected Milestone]'}
Amount: $${amount || '[Amount]'}

${description ? `Description: ${description}` : ''}

Attached documents:
${template ? '• Claim template/form' : ''}
${receipt ? '• Receipt/invoice' : ''}
${photo ? '• Site progress photo' : ''}

Please review and approve this claim at your earliest convenience.

Best regards,
Construction Team`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimEngine;