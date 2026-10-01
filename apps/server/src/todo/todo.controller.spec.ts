import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthKitService } from '../auth/authkit.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

jest.mock('@nestjs/typeorm', () => {
  const { Inject } = require('@nestjs/common');
  return {
    InjectRepository: (entity: { name: string }) =>
      Inject(`${entity.name}Repository`),
  };
});

jest.mock('../auth/authkit.service', () => ({
  AuthKitService: class AuthKitService {},
}));

describe('TodoController', () => {
  const messages = new MessageBuilder('todo');
  const create = jest.fn();
  const findAll = jest.fn();
  const findOne = jest.fn();
  const update = jest.fn();
  const remove = jest.fn();
  let controller: TodoController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: { create, findAll, findOne, update, remove },
        },
        {
          provide: AuthKitService,
          useValue: { client: { verifyAccessToken: jest.fn() } },
        },
      ],
    }).compile();

    controller = module.get(TodoController);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    create.mockReset();
    findAll.mockReset();
    findOne.mockReset();
    update.mockReset();
    remove.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const body = Object.assign(new CreateTodoDto(), {
    title: 'Buy milk',
    description: 'Whole milk',
  });
  const user = { id: 'user-1', username: 'jane' };

  describe('create()', () => {
    it('returns the service result for the current user', async () => {
      const result = {
        message: messages.success('create'),
        todo: { id: 'todo-1', title: 'Buy milk' },
      };
      create.mockResolvedValue(result);

      await expect(controller.create(body, user)).resolves.toEqual(result);
      expect(create).toHaveBeenCalledWith('user-1', 'Buy milk', 'Whole milk');
    });

    it('rethrows an HttpException from the service', async () => {
      const unauthorized = new UnauthorizedException(messages.unauthorized());
      create.mockRejectedValue(unauthorized);

      await expect(controller.create(body, user)).rejects.toBe(unauthorized);
    });

    it('wraps an unknown error as an internal server error', async () => {
      create.mockRejectedValue(new Error('database down'));

      await expect(controller.create(body, user)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });

  describe('findAll()', () => {
    it('returns the service result for the current user', async () => {
      const result = {
        message: messages.success('list'),
        todos: [{ id: 'todo-1', title: 'Buy milk' }],
      };
      findAll.mockResolvedValue(result);

      await expect(controller.findAll(user)).resolves.toEqual(result);
      expect(findAll).toHaveBeenCalledWith('user-1');
    });

    it('rethrows an HttpException from the service', async () => {
      const unauthorized = new UnauthorizedException(messages.unauthorized());
      findAll.mockRejectedValue(unauthorized);

      await expect(controller.findAll(user)).rejects.toBe(unauthorized);
    });

    it('wraps an unknown error as an internal server error', async () => {
      findAll.mockRejectedValue(new Error('database down'));

      await expect(controller.findAll(user)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });

  describe('findOne()', () => {
    const params = Object.assign(new GetTodoDto(), {
      id: '11111111-1111-4111-8111-111111111111',
    });

    it('returns the service result for the current user', async () => {
      const result = {
        message: messages.success('get'),
        todo: { id: params.id, title: 'Buy milk' },
      };
      findOne.mockResolvedValue(result);

      await expect(controller.findOne(params, user)).resolves.toEqual(result);
      expect(findOne).toHaveBeenCalledWith('user-1', params.id);
    });

    it('rethrows an HttpException from the service', async () => {
      const notFound = new NotFoundException(messages.notFound());
      findOne.mockRejectedValue(notFound);

      await expect(controller.findOne(params, user)).rejects.toBe(notFound);
    });

    it('wraps an unknown error as an internal server error', async () => {
      findOne.mockRejectedValue(new Error('database down'));

      await expect(controller.findOne(params, user)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });

  describe('update()', () => {
    const params = Object.assign(new GetTodoDto(), {
      id: '11111111-1111-4111-8111-111111111111',
    });
    const body = Object.assign(new UpdateTodoDto(), { title: 'New title' });

    it('returns the service result for the current user', async () => {
      const result = {
        message: messages.success('update'),
        todo: { id: params.id, title: 'New title' },
      };
      update.mockResolvedValue(result);

      await expect(controller.update(params, body, user)).resolves.toEqual(
        result,
      );
      expect(update).toHaveBeenCalledWith('user-1', params.id, body);
    });

    it('rethrows an HttpException from the service', async () => {
      const badRequest = new BadRequestException(
        messages.badRequest('update', 'At least one field is required.'),
      );
      update.mockRejectedValue(badRequest);

      await expect(controller.update(params, body, user)).rejects.toBe(
        badRequest,
      );
    });

    it('wraps an unknown error as an internal server error', async () => {
      update.mockRejectedValue(new Error('database down'));

      await expect(controller.update(params, body, user)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });

  describe('remove()', () => {
    const params = Object.assign(new GetTodoDto(), {
      id: '11111111-1111-4111-8111-111111111111',
    });

    it('returns the service result for the current user', async () => {
      const result = {
        message: messages.success('delete'),
        todo: { id: params.id, deletedAt: new Date() },
      };
      remove.mockResolvedValue(result);

      await expect(controller.remove(params, user)).resolves.toEqual(result);
      expect(remove).toHaveBeenCalledWith('user-1', params.id);
    });

    it('rethrows an HttpException from the service', async () => {
      const notFound = new NotFoundException(messages.notFound());
      remove.mockRejectedValue(notFound);

      await expect(controller.remove(params, user)).rejects.toBe(notFound);
    });

    it('wraps an unknown error as an internal server error', async () => {
      remove.mockRejectedValue(new Error('database down'));

      await expect(controller.remove(params, user)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });
});
