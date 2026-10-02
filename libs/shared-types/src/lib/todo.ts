export enum TodoStatus {
  InProgress = 'in_progress',
  Done = 'done',
}

export interface ICreateTodoRequestBody {
  title: string;
  description?: string;
}

export interface IListTodoQuery {
  page?: number;
  limit?: number;
}

export interface IGetTodoParams {
  id: string;
}

export interface IUpdateTodoRequestBody {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

export interface IReplaceTodoParams {
  id: string;
}

export interface IReplaceTodoRequestBody {
  title: string;
  description?: string;
  status: TodoStatus;
}
