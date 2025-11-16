import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://overpolemical-maria-lapidifical.ngrok-free.dev',
    headers: { 'Content-Type': 'application/json' },
    // 쿠키 세션 쓰는 경우만 true, 토큰이면 false 유지
    withCredentials: false,
});
