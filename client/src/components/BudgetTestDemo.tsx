import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  TestTube, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Target,
  Brain,
  Upload
} from "lucide-react";

const BudgetTestDemo = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  // Sample receipt text from timber supplier
  const sampleReceiptText = `TIMBER SUPPLIES CO
123 Builder Street
Construction Materials Invoice

Date: 2024-01-15
Invoice #: TS-2024-0115

ITEMS PURCHASED:
Pine Timber 90x45mm H3    $2,850.00
Treated Pine Posts        $1,200.00
Structural Grade Timber   $1,950.00
Hardware & Fixings        $450.00

SUBTOTAL:                 $6,450.00
GST:                      $645.00
TOTAL:                    $7,095.00

Payment Method: Credit Card
Thank you for your business!`;

  // Sample budget lines
  const budgetLines = [
    { id: '1', name: 'Foundation Materials', keyword: 'concrete', amount: 15000, category: 'materials', remaining: 12000 },
    { id: '2', name: 'Framing Timber', keyword: 'timber', amount: 25000, category: 'materials', remaining: 22000 },
    { id: '3', name: 'Roofing Materials', keyword: 'roof', amount: 18000, category: 'materials', remaining: 18000 },
    { id: '4', name: 'Electrical Work', keyword: 'electrical', amount: 12000, category: 'labor', remaining: 8000 },
    { id: '5', name: 'Plumbing Work', keyword: 'plumbing', amount: 10000, category: 'labor', remaining: 7500 }
  ];

  const runBudgetMatchTest = async () => {
    setTesting(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Perform budget matching analysis
    const lowerText = sampleReceiptText.toLowerCase();
    let bestMatch = { budgetLine: null, confidence: 0 };

    budgetLines.forEach(line => {
      let confidence = 0;
      
      // Primary keyword match
      if (lowerText.includes(line.keyword.toLowerCase())) {
        confidence += 60;
      }

      // Category-based matching
      const materialKeywords = ['supply', 'material', 'hardware', 'lumber', 'steel', 'brick'];
      const matchingKeywords = materialKeywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );
      confidence += matchingKeywords.length * 10;

      // Specific term boosting
      if (line.name.toLowerCase().includes('timber') && lowerText.includes('timber')) {
        confidence += 30;
      }
      if (lowerText.includes('structural') && line.name.toLowerCase().includes('timber')) {
        confidence += 20;
      }

      if (confidence > bestMatch.confidence) {
        bestMatch = { budgetLine: line, confidence };
      }
    });

    // Extract financial information
    const amounts = sampleReceiptText.match(/\$[\d,]+\.\d{2}/g);
    const totalAmount = amounts ? amounts[amounts.length - 1] : '$0.00'; // Last amount is usually total
    
    // Extract vendor
    const lines = sampleReceiptText.split('\n');
    const vendor = lines[0];

    // Extract date
    const dateMatch = sampleReceiptText.match(/Date:\s*(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : 'Not found';

    setTestResult({
      vendor,
      totalAmount,
      date,
      match: bestMatch,
      confidence: bestMatch.confidence,
      extractedItems: [
        'Pine Timber 90x45mm H3',
        'Treated Pine Posts', 
        'Structural Grade Timber',
        'Hardware & Fixings'
      ],
      budgetImpact: bestMatch.budgetLine ? {
        remaining: bestMatch.budgetLine.remaining - parseFloat(totalAmount.replace(/[$,]/g, '')),
        utilization: Math.round(((bestMatch.budgetLine.amount - bestMatch.budgetLine.remaining + parseFloat(totalAmount.replace(/[$,]/g, ''))) / bestMatch.budgetLine.amount) * 100)
      } : null
    });

    setTesting(false);

    // Trigger notification
    window.dispatchEvent(new CustomEvent('uploadComplete', {
      detail: { message: 'Budget matching test completed successfully' }
    }));
  };

  const resetTest = () => {
    setTestResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Test Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6" />
            Budget Matching Test Demo
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test the AI budget matching system with a sample timber supplier receipt
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={runBudgetMatchTest}
              disabled={testing}
              className="flex-1"
            >
              {testing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Run Budget Match Test
                </>
              )}
            </Button>
            {testResult && (
              <Button variant="outline" onClick={resetTest}>
                Reset Test
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sample Receipt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sample Receipt Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded border">
            <pre className="text-sm whitespace-pre-wrap font-mono">{sampleReceiptText}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {testing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 animate-pulse text-blue-600" />
                <p className="text-sm text-gray-600">Analyzing receipt and matching to budget lines...</p>
              </div>
              <Progress value={75} className="w-full" />
              <div className="text-xs text-gray-500 text-center">
                Extracting data • Matching keywords • Calculating confidence
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResult && (
        <div className="space-y-4">
          {/* Match Results */}
          {testResult.match.budgetLine && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Budget Match Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-800">Matched Budget Line</h4>
                    <p className="text-green-700">{testResult.match.budgetLine.name}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-green-700">
                        Confidence: {testResult.confidence}%
                      </Badge>
                      <Badge variant="outline" className="text-green-700">
                        Category: {testResult.match.budgetLine.category}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Budget Impact</h4>
                    <div className="space-y-1 text-sm">
                      <div>Original Budget: ${testResult.match.budgetLine.amount.toLocaleString()}</div>
                      <div>Receipt Amount: {testResult.totalAmount}</div>
                      <div>New Remaining: ${testResult.budgetImpact.remaining.toLocaleString()}</div>
                      <div>Utilization: {testResult.budgetImpact.utilization}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extracted Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Extracted Receipt Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Vendor</h4>
                  <p className="text-sm text-gray-600">{testResult.vendor}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Total Amount</h4>
                  <p className="text-lg font-bold text-green-600">{testResult.totalAmount}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Date</h4>
                  <p className="text-sm text-gray-600">{testResult.date}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Extracted Items</h4>
                <div className="flex flex-wrap gap-2">
                  {testResult.extractedItems.map((item: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claims Draft Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Generated Draft Claim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Draft Claim Ready:</strong> {testResult.match.budgetLine?.name} - {testResult.totalAmount}
                  <br />
                  <span className="text-sm text-gray-600">
                    Confidence: {testResult.confidence}% | Auto-extracted from receipt data
                  </span>
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h5 className="font-semibold mb-2">Claim Details</h5>
                <div className="space-y-1 text-sm">
                  <div><strong>Line Item:</strong> {testResult.match.budgetLine?.name}</div>
                  <div><strong>Amount:</strong> {testResult.totalAmount}</div>
                  <div><strong>Description:</strong> Construction materials purchase from {testResult.vendor}</div>
                  <div><strong>Date:</strong> {testResult.date}</div>
                  <div><strong>Status:</strong> <Badge variant="outline">Draft</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BudgetTestDemo;