import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, RefreshCw } from 'lucide-react';

const InvestorRoleFixer = () => {
  const forceInvestorLogin = () => {
    // Clear existing user data
    localStorage.removeItem("lush_user");
    
    // Set correct investor user
    const investorUser = {
      email: "investor@lush.com",
      role: "investor",
      name: "David Chen",
      loginTime: new Date().toISOString(),
      id: "investor_001"
    };
    
    localStorage.setItem("lush_user", JSON.stringify(investorUser));
    
    // Trigger auth context update
    window.dispatchEvent(new CustomEvent('userLogin'));
    
    // Force page reload to ensure clean state
    setTimeout(() => {
      window.location.href = "/investor";
    }, 500);
  };

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("lush_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Role Fix Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {user && (
          <div className="text-xs bg-gray-50 p-2 rounded">
            <strong>Current:</strong> {user.email} ({user.role})
          </div>
        )}
        
        <Button 
          onClick={forceInvestorLogin}
          className="w-full text-xs bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Force Investor Login
        </Button>
        
        <p className="text-xs text-gray-500">
          Use this if you're seeing role detection issues
        </p>
      </CardContent>
    </Card>
  );
};

export default InvestorRoleFixer;