'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContextType, LoginCredentials, User } from '../types';
import authService from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const currentUser = await authService.getMe();
        if (isMounted) {
          if (currentUser) {
            setIsAuthenticated(true);
            setUser(currentUser);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const currentUser = await authService.login(credentials);
      setIsAuthenticated(true);
      setUser(currentUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithToken = useCallback((_newToken: string, type?: string) => {
    setIsAuthenticated(true);
    setUser({ type: type || 'admin' });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: null,
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

export default AuthProvider;
