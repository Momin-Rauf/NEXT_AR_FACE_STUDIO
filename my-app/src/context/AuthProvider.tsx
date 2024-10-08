'use client';

import { SessionProvider } from "next-auth/react";

// Type definition for the props
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component to wrap children with the SessionProvider
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
