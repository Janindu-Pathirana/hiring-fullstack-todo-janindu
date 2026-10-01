import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { ILoginRequestBody, ILogoutRequestBody, IRegisterRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';
import type { AxiosError } from 'axios';
import { authApi, type LoginResponse, type LogoutResponse, type RegisterResponse } from '../api/auth.api';

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

export function useLogout(): UseMutationResult<
  LogoutResponse,
  AxiosError<{ message?: string | string[] }>,
  ILogoutRequestBody
> {
  return useMutation({
    mutationFn: authApi.logout,
  });
}
