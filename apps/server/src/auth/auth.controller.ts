import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { handleError } from '../common/handle-error';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login.dto';
import { RegisterBodyDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly messages = new MessageBuilder('user');

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    try {
      return await this.authService.register(body.username, body.password);
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    try {
      return await this.authService.login(body.username, body.password);
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }
}
