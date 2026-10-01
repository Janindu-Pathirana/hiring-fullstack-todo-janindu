import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { IsNull, Repository } from 'typeorm';
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

  async findAll(userId: string) {
    try {
      const todos = await this.todos.find({
        where: { userId, deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
      });
      return { message: this.messages.success('list'), todos };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const todo = await this.todos.findOne({
        where: { id, userId, deletedAt: IsNull() },
      });
      if (!todo) {
        throw new NotFoundException(this.messages.notFound());
      }
      return { message: this.messages.success('get'), todo };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }
}
