import type { ICreateTodoRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
import { api } from './client';

export type CreateTodoResponse = {
  message: string;
};

export const todoApi = {
  create(body: ICreateTodoRequestBody) {
    return api
      .post<CreateTodoResponse>('/api/todo', body)
      .then((response) => response.data);
  },
};
