import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Mail, Briefcase, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface InvitationData {
  name: string;
  email: string;
  role: string;
  projectId?: number;
}

const InviteAcceptance = () => {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useState(window.location.pathname);
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/invite/${token}`);
      const result = await response.json();
      
      if (result.valid) {
        setInvitation(result.invitation);
      } else {
        setError(result.message || "Invalid invitation link");
      }
    } catch (err) {
      setError("Failed to validate invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/invite/${token}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success message and redirect
        setTimeout(() => {
          navigate(result.redirectTo || "/dashboard");
        }, 2000);
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-6 w-6 text-red-600" />;
      case 'broker':
        return <Briefcase className="h-6 w-6 text-blue-600" />;
      default:
        return <User className="h-6 w-6 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Validating invitation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitting && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h1>
            <p className="text-gray-600 mb-4">
              Welcome to Lush OS! Redirecting to your dashboard...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Lush OS!</CardTitle>
          <p className="text-gray-600 mt-2">Complete your account setup</p>
        </CardHeader>
        <CardContent className="p-6">
          {invitation && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-3">
                {getRoleIcon(invitation.role)}
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{invitation.name}</h3>
                  <p className="text-sm text-gray-600">{invitation.email}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium capitalize">{invitation.role}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Choose a username"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Activate Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to join the Lush OS team
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteAcceptance;