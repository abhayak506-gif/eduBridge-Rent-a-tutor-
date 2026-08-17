'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('student');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('edubridge_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role || 'student');
      }
    } catch (e) {
      console.error('Error restoring session from localStorage:', e);
      localStorage.removeItem('edubridge_current_user');
    }
  }, []);

  const login = (token: string, userData: User) => {
    // Add token property directly to user object to keep local storage clean
    const authenticatedUser: User = {
      ...userData,
      token
    };
    setUser(authenticatedUser);
    setRole(userData.role);
    localStorage.setItem('edubridge_current_user', JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    setUser(null);
    setRole('student');
    localStorage.removeItem('edubridge_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
