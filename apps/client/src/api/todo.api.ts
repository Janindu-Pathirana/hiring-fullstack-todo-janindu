import type {
  ICreateTodoRequestBody,
  IListTodoQuery,
  TodoStatus,
} from '@hiring-fullstack-todo-janindu/shared-types';
import { api } from './client';

export const TODO_PAGE_SIZE = 10;

export type CreateTodoResponse = {
  message: string;
};

export type TodoListItem = {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type TodoListResponse = {
  message: string;
  todos: TodoListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  completed: number;
};

export const todoApi = {
  create(body: ICreateTodoRequestBody) {
    return api
      .post<CreateTodoResponse>('/api/todo', body)
      .then((response) => response.data);
  },
  list(query: IListTodoQuery) {
    return api
      .get<TodoListResponse>('/api/todo', { params: query })
      .then((response) => response.data);
  },
};
