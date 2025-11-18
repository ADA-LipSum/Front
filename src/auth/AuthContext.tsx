/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: string;
  role?: string;
  name: string;
  uuid?: string;
  profileImage?: string;
} | null;

type LoginKind = "user" | "admin";
type LoginOptions = {
  kind?: LoginKind;
  path?: string;
};

type AuthContextType = {
  user: User | undefined;
  login: (
    id: string,
    password: string,
    opts?: LoginOptions
  ) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const api = axios.create({
  baseURL: "http://3.38.107.119:8080/",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ⭐ 핵심: 초기값 undefined
  const [user, setUser] = useState<User | undefined>(undefined);

  // 로컬스토리지 복원
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const tokenType = localStorage.getItem("token_type");
    const accessToken = localStorage.getItem("access_token");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null); // 진짜 로그아웃 상태
    }

    if (tokenType && accessToken) {
      api.defaults.headers.common["Authorization"] =
        `${tokenType} ${accessToken}`;
    }
  }, []);

  const login = async (id: string, password: string, opts?: LoginOptions) => {
    const endpoint =
      opts?.path ??
      (opts?.kind === "admin" ? "/auth/admin/login" : "/auth/login");

    try {
      const res = await api.post(endpoint, { id, password });
      if (!res.data?.data) return false;

      const {
        tokenType,
        accessToken,
        refreshToken,
        uuid,
        role,
        userRealname,
        userNickname,
        profileImage,
      } = res.data.data;

      const safeUuid = uuid ?? id;
      const displayName = userNickname || userRealname || id;

      const nextUser: User = {
        id: safeUuid,
        uuid: safeUuid,
        role,
        name: displayName,
        profileImage,
      };

      localStorage.setItem("auth_user", JSON.stringify(nextUser));
      localStorage.setItem("token_type", tokenType);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      api.defaults.headers.common["Authorization"] =
        `${tokenType} ${accessToken}`;

      setUser(nextUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
