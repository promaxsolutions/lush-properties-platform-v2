import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Save,
  Send,
  Target
} from "lucide-react";
import Tesseract from "tesseract.js";

interface BudgetLine {
  id: string;
  name: string;
  keyword: string;
  amount: number;
  category: string;
  remaining: number;
}

interface DraftClaim {
  lineItem: string;
  amount: number;
  description: string;
  receiptText: string;
  confidence: number;
}

const ReceiptAnalyzer = () => {
  const [ocrText, setOcrText] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [suggestedLine, setSuggestedLine] = useState<BudgetLine | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [matchConfidence, setMatchConfidence] = useState(0);
  const [image, setImage] = useState<string | null>(null);

  // Sample budget lines - in production, fetch from API
  const sampleBudgetLines: BudgetLine[] = [
    { id: '1', name: 'Foundation Materials', keyword: 'concrete', amount: 15000, category: 'materials', remaining: 12000 },
    { id: '2', name: 'Framing Timber', keyword: 'timber', amount: 25000, category: 'materials', remaining: 22000 },
    { id: '3', name: 'Roofing Materials', keyword: 'roof', amount: 18000, category: 'materials', remaining: 18000 },
    { id: '4', name: 'Electrical Work', keyword: 'electrical', amount: 12000, category: 'labor', remaining: 8000 },
    { id: '5', name: 'Plumbing Work', keyword: 'plumbing', amount: 10000, category: 'labor', remaining: 7500 },
    { id: '6', name: 'Paint & Finishes', keyword: 'paint', amount: 8000, category: 'materials', remaining: 8000 },
    { id: '7', name: 'Insulation', keyword: 'insulation', amount: 6000, category: 'materials', remaining: 6000 },
    { id: '8', name: 'Hardware & Fixtures', keyword: 'hardware', amount: 5000, category: 'materials', remaining: 4200 }
  ];

  useEffect(() => {
    setBudgetLines(sampleBudgetLines);
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setProcessing(true);
    setProgress(0);

    try {
      // Run OCR
      const { data: { text } } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      setOcrText(text);

      // Find matching budget line
      const matched = findBestMatch(text, budgetLines);
      if (matched.budgetLine) {
        setSuggestedLine(matched.budgetLine);
        setMatchConfidence(matched.confidence);
      }

    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setProcessing(false);
      setProgress(100);
    }
  };

  const findBestMatch = (text: string, lines: BudgetLine[]) => {
    const lowerText = text.toLowerCase();
    let bestMatch: { budgetLine: BudgetLine | null; confidence: number } = {
      budgetLine: null,
      confidence: 0
    };

    lines.forEach(line => {
      let confidence = 0;
      
      // Primary keyword match
      if (lowerText.includes(line.keyword.toLowerCase())) {
        confidence += 60;
      }

      // Category-based matching
      const categoryKeywords = {
        materials: ['supply', 'material', 'hardware', 'lumber', 'steel', 'brick'],
        labor: ['labor', 'labour', 'contractor', 'service', 'work', 'installation'],
        equipment: ['rental', 'hire', 'equipment', 'machinery', 'tools']
      };

      const keywords = categoryKeywords[line.category as keyof typeof categoryKeywords] || [];
      const matchingKeywords = keywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );
      confidence += matchingKeywords.length * 10;

      // Boost confidence if specific terms are found
      if (line.name.toLowerCase().includes('foundation') && lowerText.includes('concrete')) {
        confidence += 20;
      }
      if (line.name.toLowerCase().includes('timber') && lowerText.includes('wood')) {
        confidence += 20;
      }
      if (line.name.toLowerCase().includes('electrical') && lowerText.includes('wire')) {
        confidence += 20;
      }

      if (confidence > bestMatch.confidence) {
        bestMatch = { budgetLine: line, confidence };
      }
    });

    return bestMatch;
  };

  const handleSaveDraft = async () => {
    if (!suggestedLine) return;

    // Extract amount from OCR text
    const amountPattern = /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const amounts = ocrText.match(amountPattern);
    const extractedAmount = amounts ? parseFloat(amounts[0].replace(/[$,]/g, '')) : 0;

    const draftClaim: DraftClaim = {
      lineItem: suggestedLine.name,
      amount: extractedAmount,
      description: `Claim for ${suggestedLine.name} - Auto-generated from receipt`,
      receiptText: ocrText.substring(0, 200), // First 200 chars
      confidence: matchConfidence
    };

    try {
      const response = await fetch('/api/claims/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftClaim)
      });

      if (response.ok) {
        setDraftSaved(true);
        
        // Trigger notification
        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { message: `Draft claim saved for ${suggestedLine.name}` }
        }));

        setTimeout(() => setDraftSaved(false), 3000); // Reset after 3 seconds
      }
    } catch (error) {
      console.error('Failed to save draft claim:', error);
    }
  };

  const handleWeeklyReminder = async () => {
    try {
      const response = await fetch('/api/notifications/weekly-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: 'builder@lush.com',
          message: '🔔 Weekly reminder: Upload site receipts and claim photos for current construction stage'
        })
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent('uploadComplete', {
          detail: { message: 'Weekly reminder sent to team' }
        }));
        alert("📆 Weekly reminder sent to team");
      }
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  const getBudgetUtilization = () => {
    const totalBudget = budgetLines.reduce((sum, line) => sum + line.amount, 0);
    const totalUsed = budgetLines.reduce((sum, line) => sum + (line.amount - line.remaining), 0);
    return Math.round((totalUsed / totalBudget) * 100);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Budget Matching & Claim Drafting
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload receipts to automatically match against budget lines and generate draft claims
          </p>
        </CardHeader>
      </Card>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${budgetLines.reduce((sum, line) => sum + line.amount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${budgetLines.reduce((sum, line) => sum + (line.amount - line.remaining), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${budgetLines.reduce((sum, line) => sum + line.remaining, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Utilization</span>
              <span>{getBudgetUtilization()}%</span>
            </div>
            <Progress value={getBudgetUtilization()} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Receipt Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Receipt Upload & Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Upload Receipt for Budget Match</label>
            <div className="flex gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="flex-1"
                disabled={processing}
              />
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
                className="hidden md:block"
                disabled={processing}
              />
            </div>
          </div>

          {processing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing receipt...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {image && (
            <div className="border rounded-lg p-4">
              <img 
                src={image} 
                alt="Uploaded receipt" 
                className="max-w-full h-64 object-contain mx-auto rounded"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* OCR Results */}
      {ocrText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Extracted Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 text-xs rounded whitespace-pre-wrap max-h-40 overflow-y-auto">
              {ocrText}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Budget Match */}
      {suggestedLine && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Budget Match Found</h3>
                  <p className="text-sm text-green-700">
                    Matched to: <strong>{suggestedLine.name}</strong>
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-green-700">
                      Budget: ${suggestedLine.amount.toLocaleString()}
                    </Badge>
                    <Badge variant="outline" className="text-green-700">
                      Remaining: ${suggestedLine.remaining.toLocaleString()}
                    </Badge>
                    <Badge variant="outline" className="text-green-700">
                      Confidence: {matchConfidence}%
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveDraft} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Draft Claim
              </Button>
            </div>
            
            {draftSaved && (
              <Alert className="mt-3 border-green-300 bg-green-100">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  Draft claim saved successfully! You can review and submit it from the Claims section.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Budget Lines Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Lines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Line Item</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Budget</th>
                  <th className="text-left p-2">Used</th>
                  <th className="text-left p-2">Remaining</th>
                  <th className="text-left p-2">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {budgetLines.map((line) => {
                  const used = line.amount - line.remaining;
                  const utilization = Math.round((used / line.amount) * 100);
                  
                  return (
                    <tr key={line.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{line.name}</td>
                      <td className="p-2 capitalize">
                        <Badge variant="outline">{line.category}</Badge>
                      </td>
                      <td className="p-2">${line.amount.toLocaleString()}</td>
                      <td className="p-2">${used.toLocaleString()}</td>
                      <td className="p-2 font-semibold text-green-600">
                        ${line.remaining.toLocaleString()}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress value={utilization} className="h-2" />
                          </div>
                          <span className="text-xs">{utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleWeeklyReminder} variant="outline" className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Weekly Reminder
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              View All Claims
            </Button>
            <Button variant="outline" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Auto-Reminder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptAnalyzer;