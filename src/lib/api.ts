import axios from "axios";

export const api = axios.create({
  baseURL: "http://3.38.107.119:8080",
  headers: { "Content-Type": "application/json" },
  // 쿠키 세션 쓰는 경우만 true, 토큰이면 false 유지
  withCredentials: false,
});
