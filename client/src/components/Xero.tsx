import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, RefreshCw, AlertCircle } from "lucide-react";

const Xero = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const connectToXero = () => {
    // Simulate Xero connection
    setTimeout(() => {
      setIsConnected(true);
      setLastSync(new Date());
      alert("Successfully connected to Xero!");
    }, 1500);
  };

  const syncData = () => {
    if (!isConnected) return;
    
    // Simulate data sync
    setTimeout(() => {
      setLastSync(new Date());
      alert("Data synchronized with Xero successfully!");
    }, 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Xero Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Connection Status</h3>
              <p className="text-sm text-gray-600">
                {isConnected ? "Connected to Xero" : "Not connected"}
              </p>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {!isConnected ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Connect to Xero to sync invoices, payments, and financial data
              </p>
              <Button onClick={connectToXero} className="bg-blue-600 hover:bg-blue-700">
                Connect to Xero
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {lastSync && (
                <div className="text-sm text-gray-600">
                  Last sync: {lastSync.toLocaleString()}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Invoices</h4>
                    <p className="text-2xl font-bold text-green-600">23</p>
                    <p className="text-sm text-gray-600">Synced this month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Payments</h4>
                    <p className="text-2xl font-bold text-blue-600">$156,780</p>
                    <p className="text-sm text-gray-600">Total received</p>
                  </CardContent>
                </Card>
              </div>
              
              <Button 
                onClick={syncData} 
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Data Now
              </Button>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Available Features</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Automatic invoice generation</li>
              <li>• Payment tracking and reconciliation</li>
              <li>• Financial reporting integration</li>
              <li>• Tax calculation and compliance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Xero;