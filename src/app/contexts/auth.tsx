'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = window.localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      // If no token and we're on an admin page (but not login), redirect to login
      const isAdminPage = window.location.pathname.startsWith('/admin');
      const isLoginPage = window.location.pathname === '/admin/login';
      if (isAdminPage && !isLoginPage) {
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  }, [router]);

  const login = (token: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adminToken', token);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  };

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 