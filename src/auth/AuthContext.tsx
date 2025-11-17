// src/auth/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

// eslint-disable-next-line react-refresh/only-export-components
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

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: User;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialUser = null,
}) => {
  const [user, setUser] = useState<User>(initialUser);

  // 새로고침 시 유저/토큰 복구 + axios 헤더 주입
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const tokenType = localStorage.getItem("token_type");
    const accessToken = localStorage.getItem("access_token");

    if (savedUser) {
      // 저장된 유저에 name, profileImage가 포함되어 있으므로 그대로 사용
      setUser(JSON.parse(savedUser));
    }

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

      if (!res.data?.success || !res.data?.data) return false;

      // 🔹 백엔드 응답 구조에 맞게 모두 꺼내기
      const {
        tokenType,
        accessToken,
        expiresIn,
        refreshToken,
        uuid,
        role: apiRole,
        userRealname,
        userNickname,
        profileImage,
      } = res.data.data as {
        tokenType: string;
        accessToken: string;
        expiresIn: number;
        refreshToken: string;
        uuid: string;
        role: string;
        userRealname: string;
        userNickname: string;
        profileImage?: string;
      };

      if (!tokenType || !accessToken) return false;

      const expiresAt = Date.now() + (Number(expiresIn) || 0);

      // JWT에서도 role을 한 번 더 확인 (선택)
      const payload = decodeJwt(accessToken);
      const role: string | undefined = apiRole ?? payload?.role;

      // 🔹 화면에서 보여줄 이름 (닉네임 우선, 없으면 실명, 그것도 없으면 로그인 id)
      const displayName = userNickname || userRealname || id;

      // 🔹 User 객체 생성 (id는 uuid 사용, 없으면 로그인 id)
      const nextUser: User = {
        id: uuid || id,
        role,
        name: displayName,
        uuid,
        profileImage,
      };

      // 저장
      localStorage.setItem("token_type", tokenType);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("userNickname", userNickname);
      localStorage.setItem("user_uuid", uuid);
      localStorage.setItem("expires_at", String(expiresAt));
      localStorage.setItem("auth_user", JSON.stringify(nextUser));

      // axios Authorization 헤더 주입
      api.defaults.headers.common["Authorization"] =
        `${tokenType} ${accessToken}`;

      setUser(nextUser);
      return true;
    } catch (e) {
      console.error("login error", e);
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
