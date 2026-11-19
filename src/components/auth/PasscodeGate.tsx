import React, { ReactNode } from 'react';

interface PasscodeGateProps {
  children: ReactNode;
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ children }) => {
  // Site-wide passcode is removed; public storefront is directly accessible
  return <>{children}</>;
};

