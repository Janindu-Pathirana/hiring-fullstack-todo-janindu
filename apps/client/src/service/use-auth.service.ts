import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { ILoginRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
import type { AxiosError } from 'axios';
import { authApi, type LoginResponse } from '../api/auth.api';

export function useLogin(): UseMutationResult<
  LoginResponse,
  AxiosError<{ message?: string | string[] }>,
  ILoginRequestBody
> {
  return useMutation({
    mutationFn: authApi.login,
  });
}
