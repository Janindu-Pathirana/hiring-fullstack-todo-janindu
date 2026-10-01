import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import type {
  ICreateTodoRequestBody,
  IUpdateTodoRequestBody,
} from '@hiring-fullstack-todo-janindu/shared-types';
import type { AxiosError } from 'axios';
import {
  todoApi,
  TODO_PAGE_SIZE,
  type CreateTodoResponse,
  type TodoMutationResponse,
} from '../api/todo.api';

type TodoMutationError = AxiosError<{ message?: string | string[] }>;

function refreshTodoViews(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
  void queryClient.invalidateQueries({ queryKey: ['/api/todo'] });
}

export function useCreateTodo(): UseMutationResult<
  CreateTodoResponse,
  TodoMutationError,
  ICreateTodoRequestBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      refreshTodoViews(queryClient);
    },
  });
}

export function useUpdateTodo(): UseMutationResult<
  TodoMutationResponse,
  TodoMutationError,
  { id: string; body: IUpdateTodoRequestBody }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => todoApi.update(id, body),
    onSuccess: () => {
      refreshTodoViews(queryClient);
    },
  });
}

export function useDeleteTodo(): UseMutationResult<
  TodoMutationResponse,
  TodoMutationError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: todoApi.remove,
    onSuccess: () => {
      refreshTodoViews(queryClient);
    },
  });
}

export function useTodos(page: number) {
  return useQuery({
    queryKey: ['/api/todo', page],
    queryFn: () => todoApi.list({ page, limit: TODO_PAGE_SIZE }),
  });
}
