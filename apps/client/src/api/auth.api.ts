import type { ILoginRequestBody, IRegisterRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
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
};
