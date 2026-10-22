import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4 selection:bg-[#C5A059] selection:text-[#0F172A]">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1F3D2B]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        {/* Brand Card */}
        <div className="bg-[#1E293B] border border-gray-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8B5E3C] flex items-center justify-center text-white font-serif font-bold text-2xl mx-auto shadow-md">
              CC
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
                Ceylon Crunch
              </h1>
              <p className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest mt-0.5">
                Executive Admin Portal
              </p>
            </div>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Sign in with your verified administrator credentials to access store fulfillment & catalog controls.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div>
              <label className="font-semibold text-gray-300 block mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="admin@ceyloncrunch.lk"
                  className="w-full h-11 pl-10 pr-3.5 bg-[#0F172A] rounded-xl border border-gray-700 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="font-semibold text-gray-300 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-[#0F172A] rounded-xl border border-gray-700 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8B5E3C] hover:opacity-95 text-gray-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Public Website */}
          <div className="pt-4 border-t border-gray-700/60 text-center">
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Return to Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
