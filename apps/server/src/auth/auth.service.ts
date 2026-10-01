import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthKitError, isAuthKitError } from '@janindu-pathirana/authkit';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { handleError } from '../common/handle-error';
import { AuthKitService } from './authkit.service';

@Injectable()
export class AuthService {
  private readonly messages = new MessageBuilder('user');

  constructor(private readonly authKit: AuthKitService) {}

  async register(username: string, password: string) {
    try {
      const user = await this.authKit.client.register(username, password);
      return { message: this.messages.success('register'), user };
    } catch (error) {
      if (isAuthKitError(error)) {
        throw this.toHttpError(error);
      }
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  async login(username: string, password: string) {
    try {
      const session = await this.authKit.client.loginWithSession(
        username,
        password,
      );
      return { message: this.messages.success('login'), ...session };
    } catch (error) {
      if (isAuthKitError(error)) {
        throw this.toHttpError(error);
      }
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  async refresh(refreshToken: string) {
    try {
      const session = await this.authKit.client.refresh(refreshToken);
      return { message: this.messages.success('refresh'), ...session };
    } catch (error) {
      if (isAuthKitError(error)) {
        throw this.toHttpError(error);
      }
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.authKit.client.logout(refreshToken);
      return { message: this.messages.success('logout') };
    } catch (error) {
      if (isAuthKitError(error)) {
        throw this.toHttpError(error);
      }
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  private toHttpError(error: AuthKitError): HttpException {
    switch (error.code) {
      case 'USERNAME_TAKEN':
        return new ConflictException(this.messages.alreadyExists());
      case 'USERNAME_REQUIRED':
      case 'USERNAME_TOO_SHORT':
      case 'USERNAME_TOO_LONG':
        return new BadRequestException(
          this.messages.invalid('username', error.message),
        );
      case 'PASSWORD_REQUIRED':
      case 'PASSWORD_TOO_SHORT':
      case 'PASSWORD_TOO_LONG':
        return new BadRequestException(
          this.messages.invalid('password', error.message),
        );
      case 'INVALID_CREDENTIALS':
      case 'UNAUTHORIZED':
      case 'TOKEN_INVALID':
      case 'SESSION_EXPIRED':
      case 'SESSION_REVOKED':
      case 'SESSION_NOT_FOUND':
        return new UnauthorizedException(this.messages.unauthorized());
      case 'RATE_LIMITED':
        return new HttpException(error.message, HttpStatus.TOO_MANY_REQUESTS);
      default:
        return new InternalServerErrorException(
          this.messages.somethingWentWrong(),
        );
    }
  }
}
