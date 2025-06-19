'use client';

import React, { ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyProviderWrapperProps {
  children: ReactNode;
}

export const PrivyProviderWrapper: React.FC<PrivyProviderWrapperProps> = ({ children }) => {
  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}>
      {children}
    </PrivyProvider>
  );
};
