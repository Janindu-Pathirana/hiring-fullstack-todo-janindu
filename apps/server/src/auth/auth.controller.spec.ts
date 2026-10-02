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
import { LogoutBodyDto } from './dto/logout.dto';
import { RefreshBodyDto } from './dto/refresh.dto';
import { RegisterBodyDto } from './dto/register.dto';

jest.mock('./authkit.service', () => ({
  AuthKitService: class AuthKitService {},
}));

describe('AuthController', () => {
  const messages = new MessageBuilder('user');
  const register = jest.fn();
  const login = jest.fn();
  const refresh = jest.fn();
  const logout = jest.fn();
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { register, login, refresh, logout },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    register.mockReset();
    login.mockReset();
    refresh.mockReset();
    logout.mockReset();
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

  describe('refresh()', () => {
    const body = Object.assign(new RefreshBodyDto(), {
      refreshToken: 'refresh-token',
    });

    it('returns the service result and passes the refresh token through', async () => {
      const result = {
        message: messages.success('refresh'),
        accessToken: 'next-access-token',
        refreshToken: 'next-refresh-token',
      };
      refresh.mockResolvedValue(result);

      await expect(controller.refresh(body)).resolves.toEqual(result);
      expect(refresh).toHaveBeenCalledWith('refresh-token');
    });

    it('rethrows an HttpException from the service', async () => {
      const unauthorized = new UnauthorizedException(messages.unauthorized());
      refresh.mockRejectedValue(unauthorized);

      await expect(controller.refresh(body)).rejects.toBe(unauthorized);
    });

    it('wraps an unknown error as an internal server error', async () => {
      refresh.mockRejectedValue(new Error('database down'));

      await expect(controller.refresh(body)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });

  describe('logout()', () => {
    const body = Object.assign(new LogoutBodyDto(), {
      refreshToken: 'refresh-token',
    });

    it('returns the service result and passes the refresh token through', async () => {
      const result = { message: messages.success('logout') };
      logout.mockResolvedValue(result);

      await expect(controller.logout(body)).resolves.toEqual(result);
      expect(logout).toHaveBeenCalledWith('refresh-token');
    });

    it('rethrows an HttpException from the service', async () => {
      const unauthorized = new UnauthorizedException(messages.unauthorized());
      logout.mockRejectedValue(unauthorized);

      await expect(controller.logout(body)).rejects.toBe(unauthorized);
    });

    it('wraps an unknown error as an internal server error', async () => {
      logout.mockRejectedValue(new Error('database down'));

      await expect(controller.logout(body)).rejects.toEqual(
        new InternalServerErrorException(messages.somethingWentWrong()),
      );
    });
  });
});
