import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Eye,
  Hand
} from 'lucide-react';

const MobileTestingGuide = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const testCategories = [
    {
      category: "Layout & Navigation",
      icon: <Monitor className="h-4 w-4" />,
      tests: [
        "Hamburger menu opens/closes correctly",
        "Sidebar auto-closes on navigation",
        "All cards display in single column on mobile",
        "Touch targets are minimum 48px",
        "Text is readable without zooming"
      ]
    },
    {
      category: "Forms & Buttons",
      icon: <Hand className="h-4 w-4" />,
      tests: [
        "Input fields don't cause zoom on iOS",
        "Buttons are touch-friendly (48px min)",
        "Form submission works on mobile",
        "File upload works with camera",
        "Dropdown menus are accessible"
      ]
    },
    {
      category: "Content & Tables",
      icon: <Eye className="h-4 w-4" />,
      tests: [
        "Tables scroll horizontally when needed",
        "Charts are responsive and readable",
        "Images scale properly",
        "Text wraps correctly",
        "No horizontal overflow"
      ]
    },
    {
      category: "PWA Features",
      icon: <Smartphone className="h-4 w-4" />,
      tests: [
        "Install prompt appears on mobile",
        "App works when installed",
        "Offline functionality (if implemented)",
        "Push notifications work",
        "App icon appears correctly"
      ]
    }
  ];

  const devices = [
    { name: "iPhone SE (375px)", width: 375, popular: true },
    { name: "iPhone 12/13 (390px)", width: 390, popular: true },
    { name: "iPhone 14 Pro Max (430px)", width: 430, popular: false },
    { name: "Samsung Galaxy S21 (360px)", width: 360, popular: true },
    { name: "iPad Mini (768px)", width: 768, popular: false },
    { name: "iPad (820px)", width: 820, popular: false }
  ];

  const toggleCheck = (categoryIndex: number, testIndex: number) => {
    const key = `${categoryIndex}-${testIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCompletionPercentage = () => {
    const totalTests = testCategories.reduce((acc, cat) => acc + cat.tests.length, 0);
    const completedTests = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((completedTests / totalTests) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📱 Mobile Testing Guide
        </h1>
        <p className="text-gray-600">
          Comprehensive testing checklist for Lush Properties mobile optimization
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {getCompletionPercentage()}% Complete
          </Badge>
        </div>
      </div>

      {/* Device Testing Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tablet className="h-5 w-5" />
            Device Testing Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device, idx) => (
              <div 
                key={idx}
                className={`p-3 border rounded-lg ${device.popular ? 'border-lush-primary bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{device.name}</span>
                  {device.popular && (
                    <Badge variant="secondary" className="text-xs">Priority</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{device.width}px width</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Testing Tip:</strong> Use Chrome DevTools Device Mode to test these screen sizes. 
                Focus on the "Priority" devices first for optimal coverage.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.icon}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.tests.map((test, testIndex) => {
                  const isChecked = checkedItems[`${categoryIndex}-${testIndex}`];
                  return (
                    <div 
                      key={testIndex}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleCheck(categoryIndex, testIndex)}
                    >
                      <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                        isChecked 
                          ? 'bg-lush-primary border-lush-primary text-white' 
                          : 'border-gray-300'
                      }`}>
                        {isChecked && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <span className={`text-sm ${isChecked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {test}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.open('/', '_blank')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Monitor className="h-6 w-6" />
              <span>Test in New Tab</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Lush Properties Mobile Test',
                    url: window.location.origin
                  });
                } else {
                  alert('Open in mobile browser to test sharing');
                }
              }}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Smartphone className="h-6 w-6" />
              <span>Test Mobile Share</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                const report = `Mobile Testing Report\n\nCompletion: ${getCompletionPercentage()}%\n\nTested on: ${new Date().toLocaleDateString()}`;
                navigator.clipboard?.writeText(report);
                alert('Testing report copied to clipboard!');
              }}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <CheckCircle className="h-6 w-6" />
              <span>Export Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {getCompletionPercentage() > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Testing Progress: {getCompletionPercentage()}% Complete
              </span>
            </div>
            {getCompletionPercentage() === 100 && (
              <p className="text-sm text-green-700 mt-2">
                🎉 All tests completed! Your mobile optimization is ready for deployment.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileTestingGuide;