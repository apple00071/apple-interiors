'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pathname = usePathname();

  const verifyAuth = async () => {
    // Skip verification if already redirecting
    if (isRedirecting) return;

    try {
      const response = await fetch('/api/admin/auth/verify', {
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        // If on login page and authenticated, redirect to dashboard
        if (pathname === '/admin/login') {
          setIsRedirecting(true);
          window.location.href = '/admin/dashboard';
        }
      } else {
        setIsAuthenticated(false);
        // Only redirect to login if on an admin page (but not already on login page)
        const isAdminPage = pathname?.startsWith('/admin');
        const isLoginPage = pathname === '/admin/login';
        if (isAdminPage && !isLoginPage) {
          setIsRedirecting(true);
          window.location.href = '/admin/login';
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
    } finally {
      if (!isRedirecting) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Only verify if not already redirecting
    if (!isRedirecting) {
      verifyAuth();
    }
  }, [pathname]);

  const login = async () => {
    try {
      setIsLoading(true);
      // Verify immediately after login attempt
      const response = await fetch('/api/admin/auth/verify', {
        credentials: 'include',
        cache: 'no-store'
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return; // Let the login page handle redirection
      } else {
        throw new Error('Verification failed after login');
      }
    } catch (error) {
      console.error('Login verification error:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setIsLoading(false);
      setIsRedirecting(true);
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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