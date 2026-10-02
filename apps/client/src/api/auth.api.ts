import type {
  ILoginRequestBody,
  ILogoutRequestBody,
  IRefreshRequestBody,
  IRegisterRequestBody,
} from '@hiring-fullstack-todo-janindu/shared-types';
import { api } from './client';

export type LoginResponse = {
  message: string;
  user: { id: string; username: string };
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  message: string;
  user: { id: string; username: string };
};

export type RefreshResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

export type LogoutResponse = {
  message: string;
};

export const authApi = {
  login(body: ILoginRequestBody) {
    return api
      .post<LoginResponse>('/api/auth/login', body)
      .then((response) => response.data);
  },
  register(body: IRegisterRequestBody) {
    return api
      .post<RegisterResponse>('/api/auth/register', body)
      .then((response) => response.data);
  },
  refresh(body: IRefreshRequestBody) {
    return api
      .post<RefreshResponse>('/api/auth/refresh', body, {
        skipAuthRefresh: true,
      })
      .then((response) => response.data);
  },
  logout(body: ILogoutRequestBody) {
    return api
      .post<LogoutResponse>('/api/auth/logout', body, {
        skipAuthRefresh: true,
      })
      .then((response) => response.data);
  },
};
