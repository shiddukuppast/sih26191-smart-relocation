import { AuthUser, LoginCredentials } from "./types";

const AUTH_STORAGE_KEY = "smart_relief_auth_session";

export const DEFAULT_OFFICER: AuthUser = {
  id: "OFF-2026-NDRF",
  name: "Capt. A. K. Verma",
  email: "command.officer@ndrf.gov.in",
  role: "Disaster Management Officer",
  badgeNumber: "NDRF-10BN-882",
  department: "National Disaster Response Force (NDRF)",
  rank: "Commandant, Emergency Relief Ops",
};

export const FIELD_COMMANDER: AuthUser = {
  id: "OFF-2026-FIELD",
  name: "Dr. Meenakshi Rao",
  email: "field.incident@dm.karnataka.gov.in",
  role: "Incident Commander (Western Ghats Sector)",
  badgeNumber: "KDMA-WG-412",
  department: "Karnataka State Disaster Management Authority",
  rank: "District Disaster Control Officer",
};

export async function loginWithCredentials(credentials: LoginCredentials): Promise<AuthUser> {
  // Simulate network auth latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!credentials.email || !credentials.email.includes("@")) {
    throw new Error("Please enter a valid official government or institutional email address.");
  }

  // Allow standard demo login or any valid looking email
  const emailLower = credentials.email.toLowerCase();
  let user: AuthUser;

  if (emailLower.includes("field")) {
    user = FIELD_COMMANDER;
  } else {
    user = {
      ...DEFAULT_OFFICER,
      email: credentials.email,
    };
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

export function getCurrentSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function terminateSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
