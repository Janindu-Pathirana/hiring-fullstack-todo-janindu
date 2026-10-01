import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthKitService } from '../auth/authkit.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';
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
  let controller: TodoController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: { create, findAll, findOne },
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
});
