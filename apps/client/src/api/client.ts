import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  clearStoredAuth,
  readStoredAuth,
  writeStoredAuth,
} from '../util/read-stored-auth';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const auth = readStoredAuth();
  if (auth) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;
    const url = config?.url ?? '';
    if (
      error.response?.status !== 401 ||
      !config ||
      config.skipAuthRefresh ||
      url.includes('/api/auth/')
    ) {
      return Promise.reject(error);
    }

    config.skipAuthRefresh = true;
    const auth = readStoredAuth();
    if (!auth?.refreshToken) {
      clearStoredAuth();
      return Promise.reject(error);
    }

    try {
      const { authApi } = await import('./auth.api');
      const session = await authApi.refresh({
        refreshToken: auth.refreshToken,
      });
      writeStoredAuth({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user: auth.user,
      });
      config.headers.Authorization = `Bearer ${session.accessToken}`;
      return api.request(config);
    } catch (refreshError) {
      clearStoredAuth();
      return Promise.reject(refreshError);
    }
  },
);
