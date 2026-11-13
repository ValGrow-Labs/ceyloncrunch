import React, { ReactNode } from 'react';
import { usePasscode } from '../../contexts/PasscodeContext';
import { PasscodeScreen } from './PasscodeScreen';
import { Loader2 } from 'lucide-react';

interface PasscodeGateProps {
  children: ReactNode;
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ children }) => {
  const { isUnlocked, isLoading } = usePasscode();

  // Initial loading state while verifying stored token (prevents flash of passcode screen)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/logo.png"
            alt="Ceylon Crunch"
            className="h-14 sm:h-16 w-auto object-contain animate-pulse"
          />
          <div className="flex items-center gap-2 text-xs font-medium text-[#8B5E3C]">
            <Loader2 className="w-4 h-4 animate-spin text-[#1F3D2B]" />
            <span>Verifying secure access...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not unlocked: Render the secure passcode screen
  if (!isUnlocked) {
    return <PasscodeScreen />;
  }

  // Passcode successfully entered and verified: Render website contents
  return <>{children}</>;
};

