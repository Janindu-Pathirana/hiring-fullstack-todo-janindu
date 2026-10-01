import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoStatus } from '@hiring-fullstack-todo-janindu/shared-types';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { IsNull, Not } from 'typeorm';
import { Todo } from '../todo/todo.entity';
import { DashboardService } from './dashboard.service';

jest.mock('@nestjs/typeorm', () => {
  const { Inject } = require('@nestjs/common');
  return {
    InjectRepository: (entity: { name: string }) =>
      Inject(`${entity.name}Repository`),
    getRepositoryToken: (entity: { name: string }) => `${entity.name}Repository`,
  };
});

describe('DashboardService', () => {
  const messages = new MessageBuilder('dashboard');
  const count = jest.fn();
  let service: DashboardService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Todo),
          useValue: { count },
        },
      ],
    }).compile();

    service = module.get(DashboardService);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    count.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCounts()', () => {
    it('returns available, deleted, completed, and in-progress counts', async () => {
      count
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(2);

      await expect(service.getCounts('user-1')).resolves.toEqual({
        message: messages.success('get'),
        counts: { available: 4, deleted: 1, completed: 2, inProgress: 2 },
      });
      expect(count).toHaveBeenNthCalledWith(1, {
        where: { userId: 'user-1', deletedAt: IsNull() },
      });
      expect(count).toHaveBeenNthCalledWith(2, {
        where: { userId: 'user-1', deletedAt: Not(IsNull()) },
      });
      expect(count).toHaveBeenNthCalledWith(3, {
        where: {
          userId: 'user-1',
          status: TodoStatus.Done,
          deletedAt: IsNull(),
        },
      });
      expect(count).toHaveBeenNthCalledWith(4, {
        where: {
          userId: 'user-1',
          status: TodoStatus.InProgress,
          deletedAt: IsNull(),
        },
      });
    });

    it('wraps an unexpected error as an internal server error', async () => {
      count.mockRejectedValue(new Error('database down'));

      await expect(service.getCounts('user-1')).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });
});
