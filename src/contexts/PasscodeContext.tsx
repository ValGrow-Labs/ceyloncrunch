import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  isSiteUnlocked,
  verifyPasscode,
  saveSession,
  lockSite,
  getRateLimitStatus,
  recordFailedAttempt,
  resetFailedAttempts,
} from '../lib/passcode';

interface PasscodeContextType {
  isUnlocked: boolean;
  isLoading: boolean;
  isLockedOut: boolean;
  remainingLockoutSeconds: number;
  unlock: (passcode: string) => Promise<{ success: boolean; error?: string }>;
  lock: () => void;
}

const PasscodeContext = createContext<PasscodeContextType | null>(null);

export const PasscodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [remainingLockoutSeconds, setRemainingLockoutSeconds] = useState(0);

  // Check initial authentication and rate-limiting status
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // 1. Check rate limit
      const rateLimit = getRateLimitStatus();
      if (rateLimit.isLocked && isMounted) {
        setIsLockedOut(true);
        setRemainingLockoutSeconds(rateLimit.remainingSeconds);
      }

      // 2. Check if already unlocked permanently via localStorage
      const unlocked = await isSiteUnlocked();
      if (isMounted) {
        setIsUnlocked(unlocked);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown timer when rate limited
  useEffect(() => {
    if (!isLockedOut || remainingLockoutSeconds <= 0) {
      if (isLockedOut && remainingLockoutSeconds <= 0) {
        setIsLockedOut(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setRemainingLockoutSeconds((prev) => {
        if (prev <= 1) {
          setIsLockedOut(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLockedOut, remainingLockoutSeconds]);

  const unlock = useCallback(
    async (passcode: string): Promise<{ success: boolean; error?: string }> => {
      // Check rate limit status
      const rateLimit = getRateLimitStatus();
      if (rateLimit.isLocked) {
        setIsLockedOut(true);
        setRemainingLockoutSeconds(rateLimit.remainingSeconds);
        return {
          success: false,
          error: `Too many failed attempts. Security cooldown active. Please wait ${rateLimit.remainingSeconds}s.`,
        };
      }

      const cleanPasscode = passcode.trim();
      if (!cleanPasscode) {
        return { success: false, error: 'Please enter a passcode.' };
      }

      const isValid = await verifyPasscode(cleanPasscode);

      if (isValid) {
        resetFailedAttempts();
        // Permanently save access on this browser
        await saveSession(cleanPasscode);
        setIsUnlocked(true);
        setIsLockedOut(false);
        setRemainingLockoutSeconds(0);
        return { success: true };
      } else {
        const attemptResult = recordFailedAttempt();
        if (attemptResult.isLocked) {
          setIsLockedOut(true);
          setRemainingLockoutSeconds(attemptResult.remainingSeconds);
          return {
            success: false,
            error: `Too many failed attempts. Security cooldown active for ${attemptResult.remainingSeconds}s.`,
          };
        }
        return {
          success: false,
          error: 'Incorrect passcode. Please check your credentials and try again.',
        };
      }
    },
    []
  );

  const lock = useCallback(() => {
    lockSite();
    setIsUnlocked(false);
  }, []);

  return (
    <PasscodeContext.Provider
      value={{
        isUnlocked,
        isLoading,
        isLockedOut,
        remainingLockoutSeconds,
        unlock,
        lock,
      }}
    >
      {children}
    </PasscodeContext.Provider>
  );
};

export const usePasscode = (): PasscodeContextType => {
  const context = useContext(PasscodeContext);
  if (!context) {
    throw new Error('usePasscode must be used within a PasscodeProvider');
  }
  return context;
};
