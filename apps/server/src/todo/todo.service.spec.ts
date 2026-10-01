import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import MessageBuilder from '@janindu-pathirana/message-builder';
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
  let service: TodoService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: { save },
        },
      ],
    }).compile();

    service = module.get(TodoService);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    save.mockReset();
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
});
