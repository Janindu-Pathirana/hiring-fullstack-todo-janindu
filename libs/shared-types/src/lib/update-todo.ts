import { TodoStatus } from './todo-status';

export interface IUpdateTodoRequestBody {
  title?: string;
  description?: string;
  status?: TodoStatus;
}
