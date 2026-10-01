import type { ILoginRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
import { api } from './client';

export type LoginResponse = {
  message: string;
  user: { id: string; username: string };
  accessToken: string;
  refreshToken: string;
};

export const authApi = {
  login(body: ILoginRequestBody) {
    return api
      .post<LoginResponse>('/api/auth/login', body)
      .then((response) => response.data);
  },
};
