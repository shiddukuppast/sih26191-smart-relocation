export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  badgeNumber: string;
  department: string;
  rank: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}
