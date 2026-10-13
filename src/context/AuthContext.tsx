'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  signup: (data: Partial<User> & { password?: string }) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('gkac_auth_user', JSON.stringify(data.user));
          return;
        }
      }
    } catch {}

    const cached = typeof window !== 'undefined' ? localStorage.getItem('gkac_auth_user') : null;
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  const login = async (identifier: string, password: string = '') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('gkac_auth_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.error || 'Authentication failed. Please verify your credentials.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Unable to reach server. Please check your connection.' };
    }
  };

  const signup = async (data: Partial<User> & { password?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.user) {
        setUser(resData.user);
        localStorage.setItem('gkac_auth_user', JSON.stringify(resData.user));
        return { success: true, user: resData.user, message: resData.message };
      }
      return { success: false, message: resData.error || 'Registration failed. Please check your details.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gkac_auth_user');
      document.cookie = 'gkac_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
