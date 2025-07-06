'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

  const login = (token: string) => {
    // Set the cookie with appropriate options for production
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
    });
    setIsAuthenticated(true);
    router.replace('/admin/dashboard');
  };

  const logout = () => {
    Cookies.remove('auth_token', { path: '/' });
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