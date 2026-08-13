import axios, { AxiosError } from 'axios';
import { removeToken } from '@/utils/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        removeToken();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        // Forbidden action handling
      } else if (status >= 500) {
        // Internal Server Error handling
      }
    }

    return Promise.reject(error);
  }
);

export default api;
