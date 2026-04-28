import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import FormInput from "../components/ui/FormInput";
import { authService } from "../features/auth/services/auth.service";
import heroImage from "../assets/images/hero.avif";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage("Login successful! Redirecting...");
      setFormData({ email: "", password: "" });
      setErrors({});

      // Redirect based on user role
      setTimeout(() => {
        if (result.user.role === 'admin') {
          navigate("/admin-dashboard");
        } 
       else if (result.user.role === 'organizer') {
          navigate("/organizer-dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || "Login failed";
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Navbar />

      {/* Login Section */}
      <div className="flex-1 pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="max-w-5xl w-full mx-auto">

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mb-6">
            
            {/* Left Side - Image */}
            <div className="hidden md:block w-1/2 relative">
               <img 
                src={heroImage} 
                alt="Login" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center">
                 <div className="text-white text-center p-8">
                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-lg text-indigo-100">Sign in to access your dashboard and manage your events.</p>
                 </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Sign In
            </h1>
            <p className="text-slate-600">
              Enter email and password to continue
            </p>
          </div>

          <div className="">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-12 ${errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-indigo-500"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
            </div>
          </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
