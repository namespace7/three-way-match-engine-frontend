'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContextType, LoginCredentials, User } from '../types';
import authService from '../services/authService';
import { setToken } from '@/utils/token';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const existingToken = authService.getToken();
    if (existingToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTokenState(existingToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

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
