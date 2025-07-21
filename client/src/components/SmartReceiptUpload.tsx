import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import Tesseract from "tesseract.js";

interface MilestoneCheck {
  milestone: string;
  found: boolean;
  confidence: number;
}

const SmartReceiptUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [milestones, setMilestones] = useState<MilestoneCheck[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);

  // Construction milestones to check for
  const constructionMilestones = [
    "foundation", "slab", "frame", "lockup", "roofing", "plumbing", 
    "electrical", "insulation", "drywall", "flooring", "painting", 
    "handover", "inspection", "completion"
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setProcessing(true);
    setProgress(0);

    try {
      // Run OCR on the uploaded image
      const { data: { text } } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      setOcrText(text);
      
      // Extract structured data from OCR text
      const extracted = extractReceiptData(text);
      setExtractedData(extracted);

      // Check for construction milestones
      const milestoneChecks = checkConstructionMilestones(text);
      setMilestones(milestoneChecks);

      console.log("OCR Result:", text);
      console.log("Extracted Data:", extracted);
      
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setProcessing(false);
      setProgress(100);
    }
  };

  const extractReceiptData = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Extract common receipt fields
    const data: any = {
      vendor: null,
      amount: null,
      date: null,
      items: [],
      category: null
    };

    // Find vendor (usually first few lines)
    if (lines.length > 0) {
      data.vendor = lines[0];
    }

    // Find monetary amounts
    const amountPattern = /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const amounts = text.match(amountPattern);
    if (amounts && amounts.length > 0) {
      // Take the largest amount as total
      data.amount = amounts.reduce((max, current) => {
        const num = parseFloat(current.replace(/[$,]/g, ''));
        return num > parseFloat(max.replace(/[$,]/g, '')) ? current : max;
      });
    }

    // Find dates
    const datePattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g;
    const dates = text.match(datePattern);
    if (dates && dates.length > 0) {
      data.date = dates[0];
    }

    // Categorize based on keywords
    const categories = {
      materials: ['timber', 'concrete', 'steel', 'brick', 'tile', 'paint', 'flooring'],
      labor: ['labor', 'labour', 'contractor', 'worker', 'plumber', 'electrician'],
      equipment: ['rental', 'hire', 'machinery', 'tools', 'equipment'],
      permits: ['permit', 'license', 'approval', 'council', 'inspection']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        data.category = category;
        break;
      }
    }

    return data;
  };

  const checkConstructionMilestones = (text: string): MilestoneCheck[] => {
    const lowerText = text.toLowerCase();
    
    return constructionMilestones.map(milestone => {
      const found = lowerText.includes(milestone);
      
      // Simple confidence calculation based on context
      let confidence = 0;
      if (found) {
        confidence = 0.7; // Base confidence
        
        // Boost confidence if related terms are found
        const contextTerms = {
          foundation: ['concrete', 'excavation', 'footings'],
          frame: ['timber', 'steel', 'framing'],
          roofing: ['tiles', 'sheets', 'gutters'],
          plumbing: ['pipes', 'fittings', 'water'],
          electrical: ['wiring', 'switches', 'power']
        };
        
        const terms = contextTerms[milestone as keyof typeof contextTerms] || [];
        const contextMatches = terms.filter(term => lowerText.includes(term)).length;
        confidence += contextMatches * 0.1;
        confidence = Math.min(confidence, 1.0);
      }

      return {
        milestone,
        found,
        confidence: Math.round(confidence * 100)
      };
    });
  };

  const sendMilestoneReminders = async () => {
    const foundMilestones = milestones.filter(m => m.found && m.confidence > 50);
    const missingMilestones = constructionMilestones.filter(m => 
      !foundMilestones.some(found => found.milestone === m)
    );

    if (foundMilestones.length > 0) {
      // Log milestone completion
      console.log("✅ Milestones found:", foundMilestones.map(m => m.milestone));
      
      // Dispatch milestone event for mobile notifications
      foundMilestones.forEach(milestone => {
        window.dispatchEvent(new CustomEvent('milestoneDetected', {
          detail: { milestone: milestone.milestone }
        }));
      });
      
      // Send completion notification
      try {
        await fetch('/api/notifications/milestone-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            milestones: foundMilestones,
            receipt: extractedData
          })
        });
      } catch (error) {
        console.error('Failed to send milestone notification:', error);
      }
    }

    // Check for missing critical milestones
    const criticalMissing = missingMilestones.filter(m => 
      ['foundation', 'frame', 'lockup', 'handover'].includes(m)
    );

    if (criticalMissing.length > 0) {
      alert(`🔔 Missing critical milestone receipts: ${criticalMissing.join(', ')}`);
      
      // Send WhatsApp reminder
      try {
        await fetch('/api/notifications/whatsapp-reminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Please upload receipts for missing milestones: ${criticalMissing.join(', ')}`,
            recipient: 'builder@lush.com'
          })
        });
      } catch (error) {
        console.error('Failed to send WhatsApp reminder:', error);
      }
    }
  };

  const saveParsedReceipt = async () => {
    if (!extractedData || !image) return;

    try {
      const response = await fetch('/api/receipts/smart-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ocrText,
          extractedData,
          milestones: milestones.filter(m => m.found),
          imageUrl: image
        })
      });

      if (response.ok) {
        // Dispatch custom event for mobile notifications
        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { message: 'Receipt processed and saved successfully' }
        }));

        alert('✅ Receipt processed and saved successfully!');
        
        // Reset form
        setImage(null);
        setOcrText("");
        setExtractedData(null);
        setMilestones([]);
      }
    } catch (error) {
      console.error('Failed to save receipt:', error);
      alert('❌ Failed to save receipt. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          Smart Receipt Upload & OCR
        </CardTitle>
        <p className="text-sm text-gray-600">
          Upload receipts to automatically extract data and track construction milestones
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-semibold mb-2">Upload Receipt or Photo</label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
              disabled={processing}
            />
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden md:block"
              disabled={processing}
            />
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => document.querySelector('input[capture]')?.click()}
              disabled={processing}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Processing Progress */}
        {processing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing image...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Image Preview */}
        {image && (
          <div className="border rounded-lg p-4">
            <img 
              src={image} 
              alt="Uploaded receipt" 
              className="max-w-full h-64 object-contain mx-auto rounded"
            />
          </div>
        )}

        {/* Extracted Data */}
        {extractedData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extracted Receipt Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Vendor</label>
                  <p className="text-sm text-gray-600">{extractedData.vendor || 'Not detected'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-gray-600 font-bold">{extractedData.amount || 'Not detected'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-gray-600">{extractedData.date || 'Not detected'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-gray-600 capitalize">{extractedData.category || 'Uncategorized'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Milestone Detection */}
        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Construction Milestone Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {milestones
                  .filter(m => m.found)
                  .map(milestone => (
                    <div 
                      key={milestone.milestone} 
                      className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm capitalize">{milestone.milestone}</span>
                      <span className="text-xs text-green-600">({milestone.confidence}%)</span>
                    </div>
                  ))}
              </div>
              
              {milestones.filter(m => m.found).length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No construction milestones detected in this receipt.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Raw OCR Text */}
        {ocrText && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                OCR Extracted Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 text-xs p-3 rounded whitespace-pre-wrap max-h-40 overflow-y-auto">
                {ocrText}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {extractedData && (
          <div className="flex gap-3">
            <Button onClick={saveParsedReceipt} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Save Receipt
            </Button>
            <Button onClick={sendMilestoneReminders} variant="outline" className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Check Milestones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartReceiptUpload;