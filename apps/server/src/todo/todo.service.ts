import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoStatus } from '@hiring-fullstack-todo-janindu/shared-types';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { IsNull, Repository } from 'typeorm';
import { handleError } from '../common/handle-error';
import { Todo } from './todo.entity';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;

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

  async findAll(
    userId: string,
    page = DEFAULT_PAGE,
    limit = DEFAULT_PAGE_SIZE,
  ) {
    try {
      const where = { userId, deletedAt: IsNull() };
      const [todos, total] = await this.todos.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      const completed = await this.todos.count({
        where: { ...where, status: TodoStatus.Done },
      });
      return {
        message: this.messages.success('list'),
        todos,
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
        completed,
      };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const todo = await this.findOwned(userId, id);
      return { message: this.messages.success('get'), todo };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  async update(
    userId: string,
    id: string,
    body: {
      title?: string;
      description?: string;
      status?: TodoStatus;
    },
  ) {
    try {
      if (
        body.title === undefined &&
        body.description === undefined &&
        body.status === undefined
      ) {
        throw new BadRequestException(
          this.messages.badRequest(
            'update',
            'At least one field is required.',
          ),
        );
      }

      const todo = await this.findOwned(userId, id);
      if (body.title !== undefined) {
        todo.title = body.title;
      }
      if (body.description !== undefined) {
        todo.description = body.description ? body.description : null;
      }
      if (body.status !== undefined) {
        todo.status = body.status;
      }
      todo.updatedAt = new Date();
      const saved = await this.todos.save(todo);
      return { message: this.messages.success('update'), todo: saved };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  async remove(userId: string, id: string) {
    try {
      const todo = await this.findOwned(userId, id);
      todo.deletedAt = new Date();
      const saved = await this.todos.save(todo);
      return { message: this.messages.success('delete'), todo: saved };
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  private async findOwned(userId: string, id: string) {
    const todo = await this.todos.findOne({
      where: { id, userId, deletedAt: IsNull() },
    });
    if (!todo) {
      throw new NotFoundException(this.messages.notFound());
    }
    return todo;
  }
}
