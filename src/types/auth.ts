export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

export interface User {
  id?: string;
  username?: string;
  email?: string;
  type?: string;
  role?: string;
}

export interface AuthLoginResponse {
  success: boolean;
  data: {
    user: User;
    message?: string;
  };
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
