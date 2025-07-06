'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        credentials: 'include' // Important: This ensures cookies are sent with the request
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        // If on login page and authenticated, redirect to dashboard
        if (pathname === '/admin/login') {
          router.replace('/admin/dashboard');
        }
      } else {
        setIsAuthenticated(false);
        // Only redirect to login if on an admin page (but not already on login page)
        const isAdminPage = pathname?.startsWith('/admin');
        const isLoginPage = pathname === '/admin/login';
        if (isAdminPage && !isLoginPage) {
          router.replace('/admin/login');
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
  }, [pathname]);

  const login = () => {
    setIsAuthenticated(true);
    router.replace('/admin/dashboard');
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAuthenticated(false);
    router.replace('/admin/login');
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