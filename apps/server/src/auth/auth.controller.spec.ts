import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login.dto';
import { RegisterBodyDto } from './dto/register.dto';

jest.mock('./authkit.service', () => ({
  AuthKitService: class AuthKitService {},
}));

describe('AuthController', () => {
  const messages = new MessageBuilder('user');
  const register = jest.fn();
  const login = jest.fn();
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { register, login },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    register.mockReset();
    login.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const body = Object.assign(new RegisterBodyDto(), {
    username: 'jane',
    password: 'password1',
  });

  it('returns the service result and passes the credentials through', async () => {
    const result = {
      message: messages.success('register'),
      user: { id: '1', username: 'jane' },
    };
    register.mockResolvedValue(result);

    await expect(controller.register(body)).resolves.toEqual(result);
    expect(register).toHaveBeenCalledWith('jane', 'password1');
  });

  it('rethrows an HttpException from the service', async () => {
    const conflict = new ConflictException(messages.alreadyExists());
    register.mockRejectedValue(conflict);

    await expect(controller.register(body)).rejects.toBe(conflict);
  });

  it('wraps an unknown error as an internal server error', async () => {
    register.mockRejectedValue(new Error('database down'));

    await expect(controller.register(body)).rejects.toEqual(
      new InternalServerErrorException(messages.somethingWentWrong()),
    );
  });

  describe('login()', () => {
    const body = Object.assign(new LoginBodyDto(), {
      username: 'jane',
      password: 'password1',
    });

    it('returns the service result and passes the credentials through', async () => {
      const result = {
        message: messages.success('login'),
        user: { id: '1', username: 'jane' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      login.mockResolvedValue(result);

      await expect(controller.login(body)).resolves.toEqual(result);
      expect(login).toHaveBeenCalledWith('jane', 'password1');
    });

    it('rethrows an HttpException from the service', async () => {
      const unauthorized = new UnauthorizedException(messages.unauthorized());
      login.mockRejectedValue(unauthorized);

      await expect(controller.login(body)).rejects.toBe(unauthorized);
    });

    it('wraps an unknown error as an internal server error', async () => {
      login.mockRejectedValue(new Error('database down'));

      await expect(controller.login(body)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });
});
