import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserStats } from '../types';
import { api, tokenStorage } from '../services/api';

interface AuthContextType {
  user: User | null;
  stats: UserStats | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, confirmPass?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name?: string; targetRole?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [token, setToken] = useState<string | null>(tokenStorage.get());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const currentToken = tokenStorage.get();
    if (!currentToken) {
      setUser(null);
      setStats(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res.user) {
        setUser(res.user);
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Session expired or invalid, logging out', err);
      tokenStorage.clear();
      setToken(null);
      setUser(null);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password: pass });
      tokenStorage.set(res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, confirmPass?: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register({ name, email, password: pass, confirmPassword: confirmPass });
      tokenStorage.set(res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore error
    } finally {
      tokenStorage.clear();
      setToken(null);
      setUser(null);
      setStats(null);
    }
  };

  const updateProfile = async (data: { name?: string; targetRole?: string }) => {
    const res = await api.profile.update(data);
    setUser(res.profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
