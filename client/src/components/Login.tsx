import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-lush-primary to-lush-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl font-bold text-white">L</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Lush Properties Pty Ltd</h1>
          <p className="text-lush-primary font-semibold text-xl">
            Premium Projects. Powerful Returns.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg px-6 py-10">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 text-base rounded-xl border-gray-200 shadow-sm focus:border-lush-primary focus:ring-lush-primary bg-gray-50 hover:bg-white transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 text-base rounded-xl border-gray-200 shadow-sm focus:border-lush-primary focus:ring-lush-primary bg-gray-50 hover:bg-white transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <a
                href="#"
                className="text-lush-primary hover:text-lush-primary/80 font-medium text-sm transition-colors"
              >
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-lush-primary hover:bg-lush-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
            >
              {loading ? "Signing In..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;