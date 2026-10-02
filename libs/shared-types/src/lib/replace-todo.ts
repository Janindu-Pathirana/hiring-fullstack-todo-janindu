import { TodoStatus } from './todo-status';

export interface IReplaceTodoParams {
  id: string;
}

export interface IReplaceTodoRequestBody {
  title: string;
  description?: string;
  status: TodoStatus;
}
