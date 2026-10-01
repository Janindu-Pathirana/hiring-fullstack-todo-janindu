import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { ICreateTodoRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
import type { AxiosError } from 'axios';
import {
  todoApi,
  TODO_PAGE_SIZE,
  type CreateTodoResponse,
} from '../api/todo.api';

export function useCreateTodo(): UseMutationResult<
  CreateTodoResponse,
  AxiosError<{ message?: string | string[] }>,
  ICreateTodoRequestBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['/api/todo'] });
    },
  });
}

export function useTodos(page: number) {
  return useQuery({
    queryKey: ['/api/todo', page],
    queryFn: () => todoApi.list({ page, limit: TODO_PAGE_SIZE }),
  });
}
