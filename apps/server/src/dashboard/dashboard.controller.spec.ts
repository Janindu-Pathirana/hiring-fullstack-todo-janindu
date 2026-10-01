import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthKitService } from '../auth/authkit.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

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

describe('DashboardController', () => {
  const messages = new MessageBuilder('dashboard');
  const getCounts = jest.fn();
  let controller: DashboardController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: { getCounts },
        },
        {
          provide: AuthKitService,
          useValue: { client: { verifyAccessToken: jest.fn() } },
        },
      ],
    }).compile();

    controller = module.get(DashboardController);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    getCounts.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const user = { id: 'user-1', username: 'jane' };

  describe('getCounts()', () => {
    it('returns the service result for the current user', async () => {
      const result = {
        message: messages.success('get'),
        counts: { available: 4, deleted: 1, completed: 2, inProgress: 2 },
      };
      getCounts.mockResolvedValue(result);

      await expect(controller.getCounts(user)).resolves.toEqual(result);
      expect(getCounts).toHaveBeenCalledWith('user-1');
    });

    it('rethrows an HttpException from the service', async () => {
      const unauthorized = new UnauthorizedException(messages.unauthorized());
      getCounts.mockRejectedValue(unauthorized);

      await expect(controller.getCounts(user)).rejects.toBe(unauthorized);
    });

    it('wraps an unknown error as an internal server error', async () => {
      getCounts.mockRejectedValue(new Error('database down'));

      await expect(controller.getCounts(user)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });
});
