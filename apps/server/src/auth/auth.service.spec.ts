import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthKitError } from '@janindu-pathirana/authkit';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthKitService } from './authkit.service';
import { AuthService } from './auth.service';

jest.mock('./authkit.service', () => ({
  AuthKitService: class AuthKitService {},
}));

describe('AuthService', () => {
  const messages = new MessageBuilder('user');
  const register = jest.fn();
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthKitService,
          useValue: { client: { register } },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    register.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a success message and the user without a password', async () => {
    const user = {
      id: '1',
      username: 'jane',
      createdAt: new Date('2026-10-01T00:00:00.000Z'),
      deletedAt: null,
    };
    register.mockResolvedValue(user);

    const result = await service.register('jane', 'password1');

    expect(result).toEqual({
      message: messages.success('register'),
      user,
    });
    expect(result.user).not.toHaveProperty('password');
    expect(register).toHaveBeenCalledWith('jane', 'password1');
  });

  it('maps a taken username to a conflict', async () => {
    register.mockRejectedValue(
      new AuthKitError('USERNAME_TAKEN', 'Username is already taken.'),
    );

    await expect(service.register('jane', 'password1')).rejects.toEqual(
      new ConflictException(messages.alreadyExists()),
    );
    expect(register).toHaveBeenCalledWith('jane', 'password1');
  });

  it.each([
    ['USERNAME_REQUIRED', 'Username is required.'],
    ['USERNAME_TOO_SHORT', 'Username must be at least 1 characters.'],
    ['USERNAME_TOO_LONG', 'Username must be at most 64 characters.'],
  ] as const)('maps %s to a username bad request', async (code, message) => {
    register.mockRejectedValue(new AuthKitError(code, message));

    await expect(service.register('jane', 'password1')).rejects.toEqual(
      new BadRequestException(messages.invalid('username', message)),
    );
  });

  it.each([
    ['PASSWORD_REQUIRED', 'Password is required.'],
    ['PASSWORD_TOO_SHORT', 'Password must be at least 8 characters.'],
    ['PASSWORD_TOO_LONG', 'Password must be at most 72 characters.'],
  ] as const)('maps %s to a password bad request', async (code, message) => {
    register.mockRejectedValue(new AuthKitError(code, message));

    await expect(service.register('jane', 'password1')).rejects.toEqual(
      new BadRequestException(messages.invalid('password', message)),
    );
  });

  it('maps rate limiting to status 429', async () => {
    register.mockRejectedValue(
      new AuthKitError('RATE_LIMITED', 'Too many attempts.'),
    );

    await expect(service.register('jane', 'password1')).rejects.toEqual(
      new HttpException('Too many attempts.', HttpStatus.TOO_MANY_REQUESTS),
    );
  });

  it('maps any other AuthKit error to an internal server error', async () => {
    register.mockRejectedValue(
      new AuthKitError('FAILED_TO_REGISTER', 'Failed to register user.'),
    );

    await expect(service.register('jane', 'password1')).rejects.toEqual(
      new InternalServerErrorException(messages.somethingWentWrong()),
    );
  });

  it('wraps a non-AuthKit error as an internal server error', async () => {
    register.mockRejectedValue(new Error('database down'));

    await expect(service.register('jane', 'password1')).rejects.toEqual(
      new InternalServerErrorException(messages.somethingWentWrong()),
    );
  });
});
