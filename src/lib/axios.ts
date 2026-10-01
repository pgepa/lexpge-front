import axios from 'axios';
import { env } from "@/env";  // Certifique-se de que o caminho está correto

export const api = axios.create({
  baseURL: env.VITE_API_URL,
});


api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        if (window.location.hash !== '#/sign-in') {
          window.location.hash = '#/sign-in';
        }
      }
    }
    return Promise.reject(error);
  }
);
