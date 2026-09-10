"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthState, AuthUser, LoginCredentials } from "./types";
import { getCurrentSession, loginWithCredentials, terminateSession, DEFAULT_OFFICER } from "./auth-service";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loginAsDemo: (type?: "officer" | "field") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check existing session
    const existing = getCurrentSession();
    if (existing) {
      setState({
        user: existing,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      // For immediate prototype ease, if no session, initialize as unauthenticated
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await loginWithCredentials(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      router.push("/dashboard");
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const loginAsDemo = async (type: "officer" | "field" = "officer") => {
    const email = type === "field" ? "field.incident@dm.karnataka.gov.in" : "command.officer@ndrf.gov.in";
    await login({ email, password: "demo-password-2026" });
  };

  const logout = () => {
    terminateSession();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
