import { HttpException } from '@nestjs/common';

export function handleError(
  error: unknown,
  fallbackError: HttpException,
): never {
  console.error(error);
  if (error instanceof HttpException) {
    throw error;
  }
  throw fallbackError;
}
