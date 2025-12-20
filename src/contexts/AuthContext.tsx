"use client";

import { createContext, useContext, useState, useEffect } from "react";
import authService from "@/services/authService";
import { useRouter } from "next/navigation";
import { useNoteStore } from "@/stores/useNoteStore";

// Type Definition
export interface User {
  id?: string | number;
  username: string;
  email?: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{
    success: boolean;
    message: string;
    role?: string | null;
  }>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1. Check if token exists
      const isAuth = authService.isAuthenticated();
      // 2. Get user data from local storage
      const currentUser = authService.getCurrentUser();
      
      if (isAuth && currentUser) {
        setUser(currentUser);
      } else {
        // If inconsistent state (token exists but no user data), clear everything
        if (isAuth) authService.logout();
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
    // Call service
    const result = await authService.login(username, password, rememberMe);
    
    if (result.success) {
      // Update Context State immediately
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      return { 
        success: true, 
        message: result.message,
        role: currentUser?.role ?? null,
      };
    }
    
    return { 
      success: false, 
      message: result.message,
      role: null,
    };
  };

  const register = async (username: string, email: string, password: string) => {
    return await authService.register(username, email, password);
  };

  const logout = () => {
    authService.logout();
    useNoteStore.getState().reset(); // Clear global store
    setUser(null); // Clear context
    router.push("/auth/login"); // Redirect
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