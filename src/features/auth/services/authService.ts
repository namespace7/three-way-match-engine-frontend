import api from '@/services/api';
import { LoginCredentials, User, AuthLoginResponse } from '@/types/auth';

export interface AuthMeResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post<AuthLoginResponse>('/auth/login', credentials);
  return response.data.data?.user || { type: 'admin' };
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore network error on logout
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    const response = await api.get<AuthMeResponse>('/auth/me');
    return response.data.data?.user || { type: 'admin' };
  } catch {
    return null;
  }
};

export const authService = {
  login,
  logout,
  getMe,
};

export default authService;
