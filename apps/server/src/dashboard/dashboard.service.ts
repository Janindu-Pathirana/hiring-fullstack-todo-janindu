import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoStatus } from '@hiring-fullstack-todo-janindu/shared-types';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { IsNull, Not, Repository } from 'typeorm';
import { handleError } from '../common/handle-error';
import { Todo } from '../todo/todo.entity';

@Injectable()
export class DashboardService {
  private readonly messages = new MessageBuilder('dashboard');

  constructor(
    @InjectRepository(Todo)
    private readonly todos: Repository<Todo>,
  ) {}

  async getCounts(userId: string) {
    try {
      const [available, deleted, completed, inProgress] = await Promise.all([
        this.todos.count({ where: { userId, deletedAt: IsNull() } }),
        this.todos.count({ where: { userId, deletedAt: Not(IsNull()) } }),
        this.todos.count({
          where: { userId, status: TodoStatus.Done, deletedAt: IsNull() },
        }),
        this.todos.count({
          where: {
            userId,
            status: TodoStatus.InProgress,
            deletedAt: IsNull(),
          },
        }),
      ]);

      return {
        message: this.messages.success('get'),
        counts: { available, deleted, completed, inProgress },
      };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }
}
