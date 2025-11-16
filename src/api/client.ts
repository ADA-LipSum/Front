// src/api/client.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://3.38.107.119:8080',
    headers: { 'Content-Type': 'application/json' },
});
