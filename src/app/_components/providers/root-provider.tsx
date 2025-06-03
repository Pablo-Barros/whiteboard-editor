"use client";

import { TRPCProvider } from "./trpc-provider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
