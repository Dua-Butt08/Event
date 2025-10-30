"use client";

import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from './ReduxProvider';
import React from "react";
import type { Session } from "next-auth";

interface ClientProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <ReduxProvider>
      <SessionProvider 
        session={session} 
        refetchInterval={300} 
        refetchOnWindowFocus={true}
      >
        {children}
      </SessionProvider>
    </ReduxProvider>
  );
}


