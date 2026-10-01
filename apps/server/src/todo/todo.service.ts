import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { Repository } from 'typeorm';
import { handleError } from '../common/handle-error';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  private readonly messages = new MessageBuilder('todo');

  constructor(
    @InjectRepository(Todo)
    private readonly todos: Repository<Todo>,
  ) {}

  async create(userId: string, title: string, description?: string) {
    try {
      const todo = await this.todos.save({
        userId,
        title,
        description: description ? description : null,
      });
      return { message: this.messages.success('create'), todo };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }
}
