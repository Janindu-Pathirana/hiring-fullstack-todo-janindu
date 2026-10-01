import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { handleError } from '../common/handle-error';
import { AuthService } from './auth.service';
import { RegisterBodyDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly messages = new MessageBuilder('user');

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
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
}
