"use client";

import { AuthProvider as InternalAuthProvider } from "./auth-context";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <InternalAuthProvider>{children}</InternalAuthProvider>;
}
