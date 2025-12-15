'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
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

  const login = async (username, password, rememberMe = false) => {
    try {
      const result = await authService.login(username, password, rememberMe);
      
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        return { success: true, message: result.message };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const result = await authService.register(username, email, password);
      return result;
    } catch (error) {
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

  const value = {
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

// Example usage in a component:
/*
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function SomeComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
*/