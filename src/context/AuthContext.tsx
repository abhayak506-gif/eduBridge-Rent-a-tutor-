'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { CURRENT_STUDENT, CURRENT_TUTOR_USER } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loginAsStudent: () => void;
  loginAsTutor: () => void;
  loginCustom: (emailOrPhone: string, name?: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(CURRENT_STUDENT);
  const [role, setRole] = useState<UserRole>('student');

  useEffect(() => {
    // Check saved session in browser
    try {
      const savedUser = localStorage.getItem('edubridge_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role || 'student');
      } else {
        setUser(CURRENT_STUDENT);
        setRole('student');
      }
    } catch {
      setUser(CURRENT_STUDENT);
    }
  }, []);

  const loginAsStudent = () => {
    setUser(CURRENT_STUDENT);
    setRole('student');
    if (typeof window !== 'undefined') {
      localStorage.setItem('edubridge_current_user', JSON.stringify(CURRENT_STUDENT));
    }
  };

  const loginAsTutor = () => {
    setUser(CURRENT_TUTOR_USER);
    setRole('tutor');
    if (typeof window !== 'undefined') {
      localStorage.setItem('edubridge_current_user', JSON.stringify(CURRENT_TUTOR_USER));
    }
  };

  const loginCustom = (emailOrPhone: string, name = 'Student User', newRole: UserRole = 'student') => {
    const customUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name,
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone.replace(/[^0-9]/g, '')}@student.edubridge.in`,
      phone: emailOrPhone.includes('@') ? '+91 98765 43210' : emailOrPhone,
      role: newRole,
      avatar: newRole === 'student' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      grade: 'Class 11 (PCM)',
      board: 'CBSE',
      city: 'Delhi NCR',
      preferredLanguages: ['English', 'Hindi'],
    };
    setUser(customUser);
    setRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('edubridge_current_user', JSON.stringify(customUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('edubridge_current_user');
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'tutor') {
      loginAsTutor();
    } else {
      loginAsStudent();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loginAsStudent,
        loginAsTutor,
        loginCustom,
        logout,
        switchRole,
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
