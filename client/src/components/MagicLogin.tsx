import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";

interface UserContext {
  email: string;
  name: string;
  firstName: string;
  role: string;
  projectId?: number;
  magicToken: string;
}

const MagicLogin = () => {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<UserContext | null>(null);

  useEffect(() => {
    if (token) {
      verifyMagicToken(token);
    }
  }, [token]);

  const verifyMagicToken = async (magicToken: string) => {
    try {
      const response = await fetch(`/api/magic/${magicToken}`);
      const result = await response.json();

      if (result.success) {
        const userData = result.user;
        setUser(userData);
        
        // Store token for authenticated requests
        localStorage.setItem('magicToken', userData.magicToken);
        localStorage.setItem('userContext', JSON.stringify(userData));

        // Show success message briefly before redirect
        setTimeout(() => {
          // Role-based routing
          switch (userData.role) {
            case "client":
              setLocation("/project-view");
              break;
            case "builder":
              setLocation("/builder");
              break;
            case "investor":
              setLocation("/investor-portal");
              break;
            case "broker":
            case "admin":
              setLocation("/dashboard");
              break;
            default:
              setLocation("/dashboard");
          }
        }, 2000);
      } else {
        setError(result.message || "Invalid or expired link");
      }
    } catch (err) {
      console.error("Token verification error:", err);
      setError("Failed to verify access link");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-8 w-8 text-red-600" />;
      case 'broker':
        return <Shield className="h-8 w-8 text-blue-600" />;
      default:
        return <Shield className="h-8 w-8 text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">🔐 Verifying access...</h1>
            <p className="text-gray-600">Please wait while we validate your secure link</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => setLocation("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Lush OS!</h1>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-3">
                {getRoleIcon(user.role)}
              </div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm font-medium text-blue-700 capitalize mt-2">{user.role}</p>
            </div>

            <p className="text-gray-600 mb-4">
              Redirecting to your personalized dashboard...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Secure access granted - no passwords needed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default MagicLogin;