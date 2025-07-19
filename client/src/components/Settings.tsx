import React from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, DollarSign, Palette, FileText, AlertCircle, Upload } from "lucide-react";

const AdminSettings = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Admin Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Users className="h-4 w-4 mr-2" />
          Manage Users
        </Button>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Building className="h-4 w-4 mr-2" />
          Setup Entities
        </Button>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <DollarSign className="h-4 w-4 mr-2" />
          Connect Xero
        </Button>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Palette className="h-4 w-4 mr-2" />
          Upload Branding
        </Button>
      </CardContent>
    </Card>
  </div>
);

const BrokerSettings = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Broker Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Lender Templates
        </Button>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <AlertCircle className="h-4 w-4 mr-2" />
          Update Claim Status
        </Button>
      </CardContent>
    </Card>
  </div>
);

const SolicitorSettings = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Legal & Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Contracts
        </Button>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <AlertCircle className="h-4 w-4 mr-2" />
          View Compliance Checklist
        </Button>
      </CardContent>
    </Card>
  </div>
);

const Settings = () => {
  const { role } = useAuth();
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
      </div>
      
      {role === "admin" && <AdminSettings />}
      {role === "broker" && <BrokerSettings />}
      {role === "solicitor" && <SolicitorSettings />}
      {!role && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Loading role information...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;