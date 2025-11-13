// src/auth/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

type User = { id: string; role?: string } | null;
type LoginKind = "user" | "admin";
type LoginOptions = {
  kind?: LoginKind; // 'user' | 'admin' (기본: user)
  path?: string; // 직접 경로 지정 가능: '/auth/partner/login'
};

type AuthContextType = {
  user: User;
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
  withCredentials: false, // 세션-쿠키가 아니라 토큰이므로 false 유지
});

// JWT payload 디코더 (서버가 role을 JWT에 넣어주므로 활용)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeJwt(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

// ✅ 여기: initialUser 추가
type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: User;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialUser = null,
}) => {
  // ✅ 초기값을 props로부터 받도록 변경
  const [user, setUser] = useState<User>(initialUser);

  // 새로고침 시 유저/토큰 복구 + axios 헤더 주입
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const tokenType = localStorage.getItem("token_type");
    const accessToken = localStorage.getItem("access_token");

    // ✅ savedUser가 있을 때만 덮어쓰기 (없으면 initialUser 유지)
    if (savedUser) setUser(JSON.parse(savedUser));

    if (tokenType && accessToken) {
      api.defaults.headers.common["Authorization"] =
        `${tokenType} ${accessToken}`;
    }
  }, []);

  const login = async (id: string, password: string, opts?: LoginOptions) => {
    // 엔드포인트 결정: path > kind > 기본
    const endpoint =
      opts?.path ??
      (opts?.kind === "admin" ? "/auth/admin/login" : "/auth/login");

    try {
      const res = await api.post(endpoint, { id, password });

      // 백엔드 포맷에 정확히 맞춤
      if (!res.data?.success || !res.data?.data) return false;

      const {
        tokenType, // "Bearer"
        accessToken, // JWT
        expiresIn, // ms (예: 900000)
        refreshToken, // JWT
      } = res.data.data as {
        tokenType: string;
        accessToken: string;
        expiresIn: number;
        refreshToken: string;
      };

      if (!tokenType || !accessToken) return false;

      // 만료시각 계산(클라이언트 기준)
      const expiresAt = Date.now() + (Number(expiresIn) || 0);

      // JWT에서 role 추출 (payload에 role이 들어있음)
      const payload = decodeJwt(accessToken);
      const role: string | undefined = payload?.role;

      // 화면 전역에서 쓸 최소 유저 정보
      const nextUser: User = { id, role };

      // 저장
      localStorage.setItem("token_type", tokenType);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("expires_at", String(expiresAt));
      localStorage.setItem("auth_user", JSON.stringify(nextUser));

      // axios Authorization 헤더 주입
      api.defaults.headers.common["Authorization"] =
        `${tokenType} ${accessToken}`;

      setUser(nextUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token_type");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
    delete api.defaults.headers.common["Authorization"];
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
