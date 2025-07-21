import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Clock,
  MapPin,
  Monitor,
  AlertCircle
} from 'lucide-react';

interface LoginAttempt {
  id: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  location: string;
  success: boolean;
}

interface SecurityPanelProps {
  userRole?: string;
}

const SecurityPanel = ({ userRole = 'user' }: SecurityPanelProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Mock data - in real app, this would come from API
  const [loginAttempts] = useState<LoginAttempt[]>([
    {
      id: '1',
      timestamp: new Date('2025-01-21T10:30:00'),
      ip: '203.123.45.67',
      userAgent: 'Chrome 131.0.0.0',
      location: 'Sydney, NSW',
      success: true
    },
    {
      id: '2',
      timestamp: new Date('2025-01-20T14:22:00'),
      ip: '203.123.45.67',
      userAgent: 'Safari 17.2.1',
      location: 'Sydney, NSW',
      success: true
    },
    {
      id: '3',
      timestamp: new Date('2025-01-20T09:15:00'),
      ip: '192.168.1.100',
      userAgent: 'Chrome 131.0.0.0',
      location: 'Unknown',
      success: false
    }
  ]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 30;
    
    return Math.min(strength, 100);
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (passwordStrength < 60) {
      alert('Password is too weak. Please choose a stronger password.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      alert('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTwoFAEnabled(!twoFAEnabled);
      alert(`2FA ${!twoFAEnabled ? 'enabled' : 'disabled'} successfully!`);
      
    } catch (error) {
      alert('Failed to update 2FA settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableUser = async (userId: string) => {
    if (!confirm('Are you sure you want to disable this user\'s access?')) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('User access disabled successfully!');
    } catch (error) {
      alert('Failed to disable user access.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <Shield className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600">Manage your account security and access controls</p>
        </div>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-lush-primary" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Password Strength:</span>
                    <span className={`font-medium ${
                      passwordStrength < 30 ? 'text-red-600' :
                      passwordStrength < 60 ? 'text-yellow-600' :
                      passwordStrength < 80 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || passwordStrength < 60}
              className="bg-lush-primary hover:bg-lush-primary/90"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-lush-primary" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable 2FA</h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={twoFAEnabled ? "default" : "secondary"}>
                {twoFAEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Button
                onClick={handleEnable2FA}
                disabled={isLoading}
                variant={twoFAEnabled ? "destructive" : "default"}
                className={!twoFAEnabled ? "bg-lush-primary hover:bg-lush-primary/90" : ""}
              >
                {isLoading ? 'Updating...' : twoFAEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>

          {twoFAEnabled && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Two-factor authentication is active. You'll receive SMS codes for login verification.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-lush-primary" />
            Recent Login Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className={`p-4 rounded-lg border ${
                  attempt.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {attempt.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {attempt.success ? 'Successful Login' : 'Failed Login Attempt'}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {attempt.timestamp.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {attempt.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{attempt.ip}</div>
                    <div>{attempt.userAgent}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Security Controls */}
      {userRole === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Admin Security Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Admin Access:</strong> Use these controls carefully. Actions are logged and auditable.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Emergency User Lockout</h4>
                  <p className="text-sm text-gray-600">
                    Instantly disable access for compromised accounts
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDisableUser('user123')}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Disable User
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Security Audit Log</h4>
                  <p className="text-sm text-gray-600">
                    View all security events and login attempts
                  </p>
                </div>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Audit Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityPanel;