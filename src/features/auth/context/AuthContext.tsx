'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AuthContextType, LoginCredentials, User } from '../types';
import authService from '../services/authService';
import { setToken } from '@/utils/token';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => authService.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(authService.getToken()));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setTokenState(data.token);
      setIsAuthenticated(true);
      setUser({ type: data.type });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithToken = useCallback((newToken: string, type?: string) => {
    setToken(newToken);
    setTokenState(newToken);
    setIsAuthenticated(true);
    setUser({ type });
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setTokenState(null);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        isLoading,
        user,
        login,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
