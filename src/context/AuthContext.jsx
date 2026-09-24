import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = authService.getCurrentSession();
      if (session) {
        setUser(session);
      }
    } catch (e) {
      console.error('Error recovering session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const session = await authService.login(email, password);
    setUser(session);
    return session;
  };

  const register = async (userData) => {
    const session = await authService.register(userData);
    setUser(session);
    return session;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
