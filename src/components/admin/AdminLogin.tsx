import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  showToast: (msg: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    const res = await onLogin(email.trim(), password.trim());
    setIsLoading(false);

    if (res.success) {
      showToast('Welcome back, Administrator!');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      showToast(res.error || 'Invalid administrator credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#1E4E35] selection:text-white">
      {/* Top Header Section */}
      <div className="w-full max-w-[460px] text-center mb-8">
        <a href="/" className="inline-block transition-transform hover:scale-105 duration-200">
          <img
            src="/logo.png"
            alt="Ceylon Crunch — From Nature To Your Doorstep"
            className="h-16 w-auto mx-auto object-contain"
          />
        </a>
        <h1 className="font-serif text-3xl font-bold text-[#1B4332] mt-5 tracking-tight">
          Admin Portal
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
          Sign in to manage products, orders, and configuration
        </p>
      </div>

      {/* Main White Card */}
      <div className="w-full max-w-[460px] bg-white rounded-3xl p-7 sm:p-10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] border border-stone-100">
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-700 flex items-start gap-2">
            <span className="font-bold">Error:</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="admin@ceyloncrunch.lk"
              className="w-full h-12 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
              ADMIN PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="•••••••••••••"
                className="w-full h-12 pl-4 pr-11 bg-white rounded-xl border border-stone-200 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-xl bg-[#1E4E35] hover:bg-[#163D28] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Admin Dashboard</span>
            )}
          </button>

          {/* Return to Storefront */}
          <div className="pt-2 text-center">
            <a
              href="/"
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1 font-normal"
            >
              <span>← Return to Storefront</span>
            </a>
          </div>
        </form>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-stone-400 font-normal">
        <span>Designed & Developed by </span>
        <span className="font-semibold text-[#C59B27]">ValGrow Labs</span>
      </div>
    </div>
  );
};

