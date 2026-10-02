import { IReplaceTodoParams } from '@hiring-fullstack-todo-janindu/shared-types';
import { IsUUID } from 'class-validator';

export class ReplaceTodoParamsDto implements IReplaceTodoParams {
  @IsUUID()
  id: string;
}
