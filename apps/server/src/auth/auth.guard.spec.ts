import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthKitError } from '@janindu-pathirana/authkit';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthGuard } from './auth.guard';
import { AuthKitService } from './authkit.service';

jest.mock('./authkit.service', () => ({
  AuthKitService: class AuthKitService {},
}));

describe('AuthGuard', () => {
  const messages = new MessageBuilder('user');
  const verifyAccessToken = jest.fn();
  let guard: AuthGuard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthKitService,
          useValue: { client: { verifyAccessToken } },
        },
      ],
    }).compile();

    guard = module.get(AuthGuard);
  });

  beforeEach(() => {
    verifyAccessToken.mockReset();
  });

  function contextFor(authorization?: string) {
    const request: { headers: { authorization?: string }; user?: unknown } = {
      headers: { authorization },
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
    return { request, context };
  }

  it('rejects a missing token', () => {
    const { context } = contextFor();

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException(messages.unauthorized()),
    );
    expect(verifyAccessToken).not.toHaveBeenCalled();
  });

  it('rejects an invalid token', () => {
    verifyAccessToken.mockImplementation(() => {
      throw new AuthKitError('TOKEN_INVALID', 'Invalid access token.');
    });
    const { request, context } = contextFor('Bearer bad-token');

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException(messages.unauthorized()),
    );
    expect(request.user).toBeUndefined();
  });

  it('sets the user from a valid token', () => {
    verifyAccessToken.mockReturnValue({
      sub: 'user-1',
      username: 'jane',
      typ: 'access',
    });
    const { request, context } = contextFor('Bearer good-token');

    expect(guard.canActivate(context)).toBe(true);
    expect(verifyAccessToken).toHaveBeenCalledWith('good-token');
    expect(request.user).toEqual({ id: 'user-1', username: 'jane' });
  });
});
