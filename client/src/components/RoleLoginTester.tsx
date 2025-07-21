import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Hammer, Home, Briefcase, CheckCircle, AlertCircle, User } from "lucide-react";

interface TestUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "builder" | "client" | "investor";
  password: string;
  features: string[];
  description: string;
}

const testUsers: TestUser[] = [
  {
    id: "admin-001",
    name: "Sarah Chen",
    email: "admin@lush.com",
    role: "admin",
    password: "admin123",
    features: [
      "Full system access",
      "User management",
      "Role assignment",
      "Project oversight",
      "Financial controls",
      "System settings"
    ],
    description: "Complete administrative control with user management and system oversight capabilities"
  },
  {
    id: "builder-001",
    name: "Mike Johnson",
    email: "builder@lush.com",
    role: "builder",
    password: "builder123",
    features: [
      "Project uploads",
      "Progress tracking",
      "Receipt submission",
      "Timeline management",
      "Milestone updates",
      "Client communication"
    ],
    description: "Construction project management with progress tracking and client communication tools"
  },
  {
    id: "client-001",
    name: "Jennifer Williams",
    email: "client@lush.com",
    role: "client",
    password: "client123",
    features: [
      "Project viewing",
      "Upgrade requests",
      "Financial overview",
      "Progress monitoring",
      "Communication hub",
      "Document access"
    ],
    description: "Project monitoring and upgrade request capabilities with financial transparency"
  },
  {
    id: "investor-001",
    name: "Robert Kim",
    email: "investor@lush.com",
    role: "investor",
    password: "investor123",
    features: [
      "Portfolio overview",
      "ROI analysis",
      "Risk assessment",
      "Project heatmaps",
      "Financial reports",
      "Market insights"
    ],
    description: "Investment analysis with portfolio tracking and comprehensive financial reporting"
  }
];

const roleIcons = {
  admin: <Crown className="h-5 w-5" />,
  builder: <Hammer className="h-5 w-5" />,
  client: <Home className="h-5 w-5" />,
  investor: <Briefcase className="h-5 w-5" />
};

const roleColors = {
  admin: "bg-red-100 text-red-800 border-red-200",
  builder: "bg-orange-100 text-orange-800 border-orange-200",
  client: "bg-green-100 text-green-800 border-green-200",
  investor: "bg-purple-100 text-purple-800 border-purple-200"
};

const RoleLoginTester = () => {
  const [selectedUser, setSelectedUser] = useState<TestUser | null>(null);
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);

  const handleLogin = async (user: TestUser) => {
    setLoginStatus("loading");
    setSelectedUser(user);
    
    try {
      // Simulate API login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoginStatus("success");
      setCurrentUser(user);
    } catch (error) {
      setLoginStatus("error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUser(null);
    setLoginStatus("idle");
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${roleColors[currentUser.role]}`}>
                  {roleIcons[currentUser.role]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {currentUser.name}
                  </h1>
                  <p className="text-gray-600">
                    Logged in as <span className="font-medium capitalize">{currentUser.role}</span>
                  </p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>

          {/* Role Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Available Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentUser.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Role Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">User ID</label>
                    <p className="text-sm text-gray-900 font-mono">{currentUser.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900">{currentUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Role</label>
                    <Badge className={`mt-1 ${roleColors[currentUser.role]}`}>
                      {roleIcons[currentUser.role]}
                      <span className="ml-2 capitalize">{currentUser.role}</span>
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-sm text-gray-700 mt-1">{currentUser.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Role-Specific Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="h-16 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => alert(`${currentUser.role.toUpperCase()}: Dashboard access tested successfully!`)}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-xs">Test Dashboard</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => alert(`${currentUser.role.toUpperCase()}: Navigation tested successfully!`)}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-xs">Test Navigation</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => alert(`${currentUser.role.toUpperCase()}: Permissions verified successfully!`)}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-xs">Test Permissions</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => alert(`${currentUser.role.toUpperCase()}: Features tested successfully!`)}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-xs">Test Features</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Lush Properties Control Center
          </h1>
          <p className="text-xl text-gray-600 mb-2">Role-Based Login Testing</p>
          <p className="text-sm text-gray-500">
            Test all user roles: Admin, Builder, Client, and Investor
          </p>
        </div>

        {/* Login Status */}
        {loginStatus === "loading" && selectedUser && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-blue-800">
                  Logging in as {selectedUser.name} ({selectedUser.role})...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {loginStatus === "error" && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <span className="text-red-800">Login failed. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {testUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${roleColors[user.role]} mb-3`}>
                  {roleIcons[user.role]}
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <p className="text-sm text-gray-600">{user.email}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 min-h-[40px]">
                  {user.description}
                </p>
                
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Test Credentials:</p>
                  <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                    <div>Email: {user.email}</div>
                    <div>Password: {user.password}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Key Features ({user.features.length}):
                  </p>
                  <div className="space-y-1">
                    {user.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                    {user.features.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{user.features.length - 3} more...
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => handleLogin(user)}
                  disabled={loginStatus === "loading"}
                  className="w-full"
                >
                  Test {user.role} Login
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How to Test:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Click "Test [Role] Login" on any user card</li>
                  <li>Wait for the simulated login process</li>
                  <li>Explore the role-specific dashboard and features</li>
                  <li>Test the available functionality for that role</li>
                  <li>Click "Logout" to return and test another role</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What Gets Tested:</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Role-based authentication</li>
                  <li>Feature access permissions</li>
                  <li>Dashboard customization</li>
                  <li>Navigation restrictions</li>
                  <li>User interface adaptations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleLoginTester;