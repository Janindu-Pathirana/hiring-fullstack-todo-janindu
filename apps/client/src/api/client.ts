import axios from 'axios';
import { readStoredAuth } from '../common/read-stored-auth';

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
