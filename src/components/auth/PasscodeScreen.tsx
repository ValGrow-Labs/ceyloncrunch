import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { usePasscode } from '../../contexts/PasscodeContext';

export const PasscodeScreen: React.FC = () => {
  const { unlock, isLockedOut, remainingLockoutSeconds } = usePasscode();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) {
      triggerShake();
      return;
    }

    if (!passcode.trim()) {
      setErrorMessage('Please enter the access passcode.');
      triggerShake();
      inputRef.current?.focus();
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await unlock(passcode);
      if (!result.success) {
        setErrorMessage(result.error || 'Incorrect passcode. Please try again.');
        triggerShake();
        inputRef.current?.focus();
      }
    } catch {
      setErrorMessage('Verification failed. Please try again.');
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#2B2B2B] flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-[#EADFD0] selection:text-[#1F3D2B] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#EADFD0]/40 to-transparent blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-[#D9A441]/5 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="w-full max-w-[460px] my-auto relative z-10 flex flex-col items-center">
        {/* Brand Header - Centered Logo at the top */}
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center w-full">
          <div className="inline-flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
            <img
              src="/logo.png"
              alt="Ceylon Crunch"
              className="h-16 sm:h-20 lg:h-22 w-auto mx-auto object-contain drop-shadow-2xs"
            />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B] mt-5 sm:mt-6 tracking-tight">
            Enter Access Passcode
          </h1>

          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2 font-normal max-w-sm mx-auto leading-relaxed">
            Welcome to Ceylon Crunch. Enter your passcode to continue.
          </p>
        </div>

        {/* Passcode Card */}
        <div
          className={`w-full bg-white rounded-3xl p-6 sm:p-9 shadow-[0_20px_50px_-12px_rgba(31,61,43,0.08)] border border-[#EADFD0] transition-transform duration-200 ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/* Lockout Warning Banner */}
          {isLockedOut ? (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Security Cooldown Active</p>
                <p className="mt-0.5 text-amber-700">
                  Too many failed attempts. Please wait{' '}
                  <span className="font-mono font-bold text-amber-900">{remainingLockoutSeconds}s</span> before
                  trying again.
                </p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Access Denied: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B5E3C]/70 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="passcode-input"
                  ref={inputRef}
                  type={showPasscode ? 'text' : 'password'}
                  required
                  aria-label="Access Passcode"
                  disabled={isSubmitting || isLockedOut}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter passcode..."
                  autoComplete="current-password"
                  className="w-full h-12 pl-10 pr-11 bg-white rounded-xl border border-[#EADFD0] text-[#2B2B2B] text-sm placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#1F3D2B] focus:ring-2 focus:ring-[#1F3D2B]/15 transition-all disabled:opacity-60 disabled:bg-[#FAF8F5] disabled:cursor-not-allowed font-sans"
                />

                <button
                  type="button"
                  tabIndex={-1}
                  disabled={isLockedOut}
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1F3D2B] transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1F3D2B]"
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLockedOut || !passcode.trim()}
              className="w-full h-12 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>Verifying Passcode...</span>
                </>
              ) : isLockedOut ? (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Cooldown ({remainingLockoutSeconds}s)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                  <span>Unlock Storefront</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Required Small Footer: "Powered by ValGrow Labs" */}
      <footer className="w-full max-w-[460px] mt-6 sm:mt-8 pt-4 border-t border-[#EADFD0]/50 flex flex-col items-center justify-center gap-1 text-xs text-[#6B6B6B] relative z-10">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/valgrow-logo.png"
            alt="ValGrow Labs Logo"
            className="h-3.5 sm:h-4 w-auto object-contain opacity-85"
          />
          <span className="font-normal">
            Powered by{' '}
            <strong className="font-semibold text-[#1F3D2B]">ValGrow Labs</strong>
          </span>
        </div>
        <p className="text-[10px] text-[#A0A0A0]">
          © 2026 Ceylon Crunch (Pvt) Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
