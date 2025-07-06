'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        credentials: 'include', // Important: This ensures cookies are sent with the request
        cache: 'no-store' // Prevent caching of the verification request
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

  const login = async () => {
    try {
      // Verify immediately after login attempt
      const response = await fetch('/api/admin/auth/verify', {
        credentials: 'include',
        cache: 'no-store'
      });

      if (response.ok) {
        setIsAuthenticated(true);
        router.replace('/admin/dashboard');
      } else {
        throw new Error('Verification failed after login');
      }
    } catch (error) {
      console.error('Login verification error:', error);
      setIsAuthenticated(false);
      throw error; // Re-throw to be handled by the login page
    }
  };

  const logout = async () => {
    try {
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
      router.replace('/admin/login');
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