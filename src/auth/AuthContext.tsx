// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { email: string } | null;
type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// 원하는 하드코딩 계정
const HARDCODED = { email: 'admin@example.com', password: '1234' };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  // 새로고침 시 복구
  useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email: string, password: string) => {
    if (email === HARDCODED.email && password === HARDCODED.password) {
      const u = { email };
      setUser(u);
      localStorage.setItem('auth_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
