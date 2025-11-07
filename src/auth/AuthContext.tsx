// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type User = { id: string } | null;
type AuthContextType = {
    user: User;
    login: (id: string, password: string) => Promise<boolean>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// 공용 axios 인스턴스
const api = axios.create({
    baseURL: 'https://overpolemical-maria-lapidifical.ngrok-free.dev',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false, // 세션-쿠키 인증이면 true, 토큰 인증이면 false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(null);

    // 새로고침 시 복구
    useEffect(() => {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = async (id: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { id, password });

            // 서버 응답 예시 가정: { success: boolean, data?: { user?: { id: string; ... }, accessToken?: string }, message?: string }
            const ok = !!res.data?.success;
            if (!ok) return false;

            // 토큰 추출 (가능한 위치 모두 시도)
            const accessToken =
                res.data?.data?.accessToken ?? res.headers?.['authorization'] ?? res.data?.token ?? null;

            if (accessToken) {
                localStorage.setItem('access_token', accessToken);
            }

            // 유저 정보 추출 (없으면 최소 id만 저장)
            const serverUser: User =
                res.data?.data?.user ?? (res.data?.data?.id ? { id: String(res.data.data.id) } : { id });

            setUser(serverUser);
            localStorage.setItem('auth_user', JSON.stringify(serverUser));
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e: unknown) {
            // 400/401 등 실패는 false
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('access_token');
    };

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
