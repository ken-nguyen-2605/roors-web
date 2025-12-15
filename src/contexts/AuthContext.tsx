'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    username: string, 
    password: string, 
    rememberMe?: boolean
  ) => Promise<any>;
  register: (
    username: string, 
    email: string, 
    password: string
  ) => Promise<any>;
  logout: () => void;
  checkAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      if (isAuth && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string, rememberMe = false) => {
    try {
      const result = await authService.login(username, password, rememberMe);
      
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        return { success: true, message: result.message };
      }
      
      return { success: false, message: result.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const result = await authService.register(username, email, password);
      return result;
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/auth/login');
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}