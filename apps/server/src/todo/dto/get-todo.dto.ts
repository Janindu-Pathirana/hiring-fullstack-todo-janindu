import { IGetTodoParams } from '@hiring-fullstack-todo-janindu/shared-types';
import { IsUUID } from 'class-validator';

export class GetTodoDto implements IGetTodoParams {
  @IsUUID()
  id: string;
}
