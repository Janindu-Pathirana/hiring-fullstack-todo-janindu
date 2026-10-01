import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { IsNull } from 'typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

jest.mock('@nestjs/typeorm', () => {
  const { Inject } = require('@nestjs/common');
  return {
    InjectRepository: (entity: { name: string }) =>
      Inject(`${entity.name}Repository`),
    getRepositoryToken: (entity: { name: string }) => `${entity.name}Repository`,
  };
});

describe('TodoService', () => {
  const messages = new MessageBuilder('todo');
  const save = jest.fn();
  const find = jest.fn();
  const findOne = jest.fn();
  let service: TodoService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: { save, find, findOne },
        },
      ],
    }).compile();

    service = module.get(TodoService);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    save.mockReset();
    find.mockReset();
    findOne.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create()', () => {
    it('saves the todo for the given user', async () => {
      const todo = {
        id: 'todo-1',
        userId: 'user-1',
        title: 'Buy milk',
        description: 'Whole milk',
        status: 'in_progress',
      };
      save.mockResolvedValue(todo);

      await expect(
        service.create('user-1', 'Buy milk', 'Whole milk'),
      ).resolves.toEqual({
        message: messages.success('create'),
        todo,
      });
      expect(save).toHaveBeenCalledWith({
        userId: 'user-1',
        title: 'Buy milk',
        description: 'Whole milk',
      });
    });

    it('stores an omitted description as null', async () => {
      save.mockResolvedValue({ id: 'todo-1' });

      await service.create('user-1', 'Buy milk');

      expect(save).toHaveBeenCalledWith({
        userId: 'user-1',
        title: 'Buy milk',
        description: null,
      });
    });

    it('wraps an unexpected error as an internal server error', async () => {
      save.mockRejectedValue(new Error('database down'));

      await expect(service.create('user-1', 'Buy milk')).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });

  describe('findAll()', () => {
    it('returns the current user todos that are not deleted', async () => {
      const todos = [{ id: 'todo-1', userId: 'user-1', title: 'Buy milk' }];
      find.mockResolvedValue(todos);

      await expect(service.findAll('user-1')).resolves.toEqual({
        message: messages.success('list'),
        todos,
      });
      expect(find).toHaveBeenCalledWith({
        where: { userId: 'user-1', deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne()', () => {
    it('returns the todo owned by the user', async () => {
      const todo = { id: 'todo-1', userId: 'user-1', title: 'Buy milk' };
      findOne.mockResolvedValue(todo);

      await expect(service.findOne('user-1', 'todo-1')).resolves.toEqual({
        message: messages.success('get'),
        todo,
      });
      expect(findOne).toHaveBeenCalledWith({
        where: { id: 'todo-1', userId: 'user-1', deletedAt: IsNull() },
      });
    });

    it('returns not found when the todo is missing', async () => {
      findOne.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'todo-1')).rejects.toEqual(
        new NotFoundException(messages.notFound()),
      );
    });
  });
});
