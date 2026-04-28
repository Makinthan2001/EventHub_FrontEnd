import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import FormInput from "../components/ui/FormInput";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState(1);

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    setTimeout(() => {
      setSuccessMessage('Verification code sent to your email!');
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleBackClick = () => {
    if (step === 2) {
      setStep(1);
      setSuccessMessage('');
    } else if (step === 3) {
      setStep(2);
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Navbar />

      <div className="flex-1 pt-32 pb-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Reset Password</h1>
            <p className="text-slate-600">Don't worry, we'll help you get back to your account</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-6">
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors('');
                  }}
                  error={errors}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {successMessage && (
                  <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm flex gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    {successMessage}
                  </div>
                )}
                <p className="text-slate-600 text-sm">Enter the code sent to {email}</p>
                <FormInput
                  label="Verification Code"
                  name="code"
                  type="text"
                  placeholder="000000"
                  value=""
                  onChange={() => { }}
                  required
                />
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg font-semibold"
                >
                  Verify Code
                </button>
                <button
                  onClick={handleBackClick}
                  className="w-full flex items-center justify-center gap-2 text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <FormInput
                  label="New Password"
                  name="password"
                  type="password"
                  value=""
                  onChange={() => { }}
                  required
                />
                <button
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg font-semibold"
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
