export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

export interface AuthTokenData {
  token: string;
  type?: string;
}

export interface AuthLoginResponse {
  success: boolean;
  data: AuthTokenData;
  message?: string;
}

export interface User {
  id?: string;
  email?: string;
  type?: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithToken: (token: string, type?: string) => void;
  logout: () => void;
}
