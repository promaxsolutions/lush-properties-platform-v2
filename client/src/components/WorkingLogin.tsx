import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const testUsers = {
  "admin@lush.com": { password: "admin123", role: "admin", name: "Sarah Chen" },
  "builder@lush.com": { password: "builder123", role: "builder", name: "Mike Johnson" },
  "client@lush.com": { password: "client123", role: "client", name: "Jennifer Williams" },
  "investor@lush.com": { password: "investor123", role: "investor", name: "Robert Kim" },
  "accountant@lush.com": { password: "accountant123", role: "accountant", name: "Emma Davis" }
};

const WorkingLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = testUsers[email.toLowerCase() as keyof typeof testUsers];
      
      if (!user) {
        throw new Error("User not found");
      }
      
      if (user.password !== password) {
        throw new Error("Invalid password");
      }

      // Store user in localStorage (in real app, this would be JWT tokens)
      localStorage.setItem("lush_user", JSON.stringify({
        email: email.toLowerCase(),
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString()
      }));

      setSuccess(`Welcome ${user.name}! Redirecting to dashboard...`);
      
      // Redirect based on role
      setTimeout(() => {
        switch (user.role) {
          case "admin":
            navigate("/dashboard");
            break;
          case "builder":
            navigate("/builder");
            break;
          case "client":
            navigate("/client");
            break;
          case "investor":
            navigate("/investor-portal");
            break;
          case "accountant":
            navigate("/finance");
            break;
          default:
            navigate("/dashboard");
        }
      }, 1500);

    } catch (err) {
      setError("Invalid email or password. Please check your credentials and try again.");
    } finally {
      setLoading(false);
      setIsLoading(false);
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

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 rounded-xl">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {success}
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

            {/* Test Credentials Helper */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm">
              <p className="font-medium text-blue-900 mb-2">Test Credentials:</p>
              <div className="space-y-1 text-blue-800">
                <div>Admin: admin@lush.com / admin123</div>
                <div>Builder: builder@lush.com / builder123</div>
                <div>Client: client@lush.com / client123</div>
                <div>Investor: investor@lush.com / investor123</div>
                <div>Accountant: accountant@lush.com / accountant123</div>
              </div>
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
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-lush-primary hover:bg-lush-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-8 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkingLogin;