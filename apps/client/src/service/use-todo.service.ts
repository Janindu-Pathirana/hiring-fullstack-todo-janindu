import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { ICreateTodoRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
import type { AxiosError } from 'axios';
import { todoApi, type CreateTodoResponse } from '../api/todo.api';

export function useCreateTodo(): UseMutationResult<
  CreateTodoResponse,
  AxiosError<{ message?: string | string[] }>,
  ICreateTodoRequestBody
> {
  return useMutation({
    mutationFn: todoApi.create,
  });
}
