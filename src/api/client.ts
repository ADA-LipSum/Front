import axios from "axios";

export const api = axios.create({
  baseURL: "http://3.38.107.119:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // 저장된 토큰
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
