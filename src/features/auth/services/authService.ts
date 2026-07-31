import api from '@/services/api';
import { getToken as getStoredToken, setToken, removeToken, hasToken } from '@/utils/token';
import { LoginCredentials, AuthLoginResponse } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthLoginResponse['data']> => {
  const response = await api.post<AuthLoginResponse>('/auth/login', credentials);
  const data = response.data.data;
  if (data?.token) {
    setToken(data.token);
  }
  return data;
};

export const logout = (): void => {
  removeToken();
};

export const getToken = (): string | null => {
  return getStoredToken();
};

export const isAuthenticated = (): boolean => {
  return hasToken();
};

export const authService = {
  login,
  logout,
  getToken,
  isAuthenticated,
};

export default authService;
