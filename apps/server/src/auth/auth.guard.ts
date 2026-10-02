import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { extractBearerToken, isAuthKitError } from '@janindu-pathirana/authkit';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthKitService } from './authkit.service';

export type RequestUser = {
  id: string;
  username: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly messages = new MessageBuilder('user');

  constructor(private readonly authKit: AuthKitService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = extractBearerToken(request.headers?.authorization);

    if (!token) {
      throw new UnauthorizedException(this.messages.unauthorized());
    }

    try {
      const payload = this.authKit.client.verifyAccessToken(token);
      request.user = {
        id: payload.sub,
        username: payload.username,
      } satisfies RequestUser;
      return true;
    } catch (error) {
      if (
        isAuthKitError(error) &&
        (error.code === 'UNAUTHORIZED' ||
          error.code === 'TOKEN_INVALID' ||
          error.code === 'TOKEN_EXPIRED')
      ) {
        throw new UnauthorizedException(this.messages.unauthorized());
      }
      throw error;
    }
  }
}
