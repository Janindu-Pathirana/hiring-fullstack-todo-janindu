import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { ILoginRequestBody, IRegisterRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
import type { AxiosError } from 'axios';
import { authApi, type LoginResponse, type RegisterResponse } from '../api/auth.api';

export function useLogin(): UseMutationResult<
  LoginResponse,
  AxiosError<{ message?: string | string[] }>,
  ILoginRequestBody
> {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useRegister(): UseMutationResult<
  RegisterResponse,
  AxiosError<{ message?: string | string[] }>,
  IRegisterRequestBody
> {
  return useMutation({
    mutationFn: authApi.register,
  });
}
