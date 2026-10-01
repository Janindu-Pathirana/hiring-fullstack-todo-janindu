import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from './auth.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser =>
    context.switchToHttp().getRequest().user,
);
