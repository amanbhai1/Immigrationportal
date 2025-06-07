import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  KeyRound,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = "login" | "signup" | "forgot" | "otp";

const Login = () => {
  // Form states
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState("");
  
  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();

  // Auth context
  const { 
    login: authLogin, 
    register: authRegister, 
    verifyOTP: authVerifyOTP,
    resendOTP: authResendOTP,
    cancelOTPVerification,
    error: authError, 
    isLoading: authLoading,
    otpSession,
    authStage,
    isAuthenticated
  } = useAuth();

  // Update component state when auth stage changes
  useEffect(() => {
    if (authStage === 'otp-verification' && otpSession) {
      setAuthMode('otp');
      setEmail(otpSession.email);
      startResendTimer();
      
      // Set success message based on OTP purpose
      if (otpSession.purpose === 'registration') {
        setSuccess("Account registration initiated! Please verify your email with the code we sent.");
      } else if (otpSession.purpose === 'login') {
        setSuccess("Please verify your identity with the code sent to your email.");
      } else {
        setSuccess("Please verify your account with the code sent to your email.");
      }
      setError("");
    }
  }, [authStage, otpSession]);

  // Update local error state when auth context error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
      setSuccess("");
    }
  }, [authError]);

  // Navigate to dashboard on successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (authMode === "login") {
        await authLogin({ email, password });
      } else if (authMode === "signup") {
        // Validate form
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (password.length < 8) {
          setError("Password must be at least 8 characters long");
          return;
        }
        if (!firstName.trim() || !lastName.trim()) {
          setError("Please provide both first and last name");
          return;
        }

        // Combine first and last name
        const name = `${firstName.trim()} ${lastName.trim()}`;
        await authRegister({ name, email, password });
      } else if (authMode === "forgot") {
        // For now, just simulate this as we don't have a forgot password API yet
        setSuccess("Password reset functionality will be available soon!");
      } else if (authMode === "otp") {
        if (otp.length !== 6) {
          setError("Please enter a valid 6-digit verification code");
          return;
        }
        await authVerifyOTP(otp);
      }
    } catch (err) {
      // Error is already handled in the auth context
      console.error('Auth error:', err);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    if (resendTimer === 0) {
      try {
        await authResendOTP();
        setSuccess("New verification code sent!");
        setError("");
        startResendTimer();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to resend code');
      }
    }
  };

  // Handle cancel OTP verification
  const handleCancelOTP = () => {
    cancelOTPVerification();
    setAuthMode("login");
    setOtp("");
    setError("");
    setSuccess("");
    setResendTimer(0);
  };

  // Switch between auth modes
  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setError("");
    setSuccess("");
    setOtp("");
    setResendTimer(0);
    
    // Clear form fields when switching modes
    if (mode === "login") {
      setFirstName("");
      setLastName("");
      setConfirmPassword("");
    }
  };

  // Get form title and description
  const getFormInfo = () => {
    switch (authMode) {
      case "login":
        return {
          title: "Welcome Back",
          description: "Sign in to your Immigration Portal account",
          icon: <User className="h-6 w-6 text-blue-600" />,
        };
      case "signup":
        return {
          title: "Create Account",
          description: "Join Immigration Portal to start your journey",
          icon: <UserPlus className="h-6 w-6 text-green-600" />,
        };
      case "forgot":
        return {
          title: "Reset Password",
          description: "Enter your email to receive a reset code",
          icon: <KeyRound className="h-6 w-6 text-orange-600" />,
        };
      case "otp":
        return {
          title: "Verify Your Email",
          description: `Enter the 6-digit code sent to ${email}`,
          icon: <Shield className="h-6 w-6 text-purple-600" />,
        };
      default:
        return {
          title: "Authentication",
          description: "Access your account",
          icon: <User className="h-6 w-6 text-blue-600" />,
        };
    }
  };

  const formInfo = getFormInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                Immigration Portal
              </h1>
              <p className="text-sm text-blue-600 font-medium">
                Your Path to Canada
              </p>
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
                {formInfo.icon}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {formInfo.title}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {formInfo.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 font-medium">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login Form */}
              {authMode === "login" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              )}

              {/* Signup Form */}
              {authMode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 border-gray-300 focus:border-blue-500"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12 border-gray-300 focus:border-blue-500"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium mb-2">
                      Password Requirements:
                    </p>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Mix of letters, numbers recommended</li>
                    </ul>
                  </div>
                </>
              )}

              {/* Forgot Password Form */}
              {authMode === "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              )}

              {/* OTP Verification Form */}
              {authMode === "otp" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-700 font-medium">
                        Verification code sent to:
                      </p>
                      <p className="text-sm text-blue-600 font-mono">{email}</p>
                    </div>

                    <Label className="text-sm font-medium text-gray-700 block mb-4">
                      Enter 6-digit verification code
                    </Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                          <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                          <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                          <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                          <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                          <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || authLoading}
                      className={`text-sm font-medium ${
                        resendTimer > 0 || authLoading
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      {authLoading
                        ? "Sending..."
                        : resendTimer > 0
                        ? `Resend in ${resendTimer}s`
                        : "Resend Code"}
                    </button>

                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg"
                disabled={authLoading}
              >
                {authLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {authMode === "login" && "Sign In"}
                    {authMode === "signup" && "Create Account"}
                    {authMode === "forgot" && "Send Reset Code"}
                    {authMode === "otp" && "Verify Code"}
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>

              {/* Back Button for non-login modes */}
              {authMode !== "login" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => authMode === "otp" ? handleCancelOTP() : switchMode("login")}
                  className="w-full h-12 border-gray-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {authMode === "otp" ? "Cancel Verification" : "Back to Sign In"}
                </Button>
              )}
            </form>

            {/* Mode Toggle Links */}
            <div className="text-center space-y-4 mt-6">
              {authMode === "login" && (
                <>

                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign up here
                    </button>
                  </p>
                </>
              )}

              {authMode === "signup" && (
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              )}

              {authMode === "forgot" && (
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              )}

              <p className="text-sm text-gray-500">
                Need help?{" "}
                <Link
                  to="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Immigration Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;