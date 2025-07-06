'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        const isAdminPage = window.location.pathname.startsWith('/admin');
        const isLoginPage = window.location.pathname === '/admin/login';
        if (isAdminPage && !isLoginPage) {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, [router]);

  const login = (token: string) => {
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('auth_token', { path: '/' });
    setIsAuthenticated(false);
    router.push('/admin/login');
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