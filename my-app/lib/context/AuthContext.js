'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLE } from '../models/User';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('hotelUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('hotelUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hotelUser');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasPermission = (requiredRole) => {
    const roleHierarchy = {
      [USER_ROLE.GUEST]: 1,
      [USER_ROLE.HOUSEKEEPER]: 2,
      [USER_ROLE.RECEPTIONIST]: 3,
      [USER_ROLE.MANAGER]: 4
    };
    return roleHierarchy[user?.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
