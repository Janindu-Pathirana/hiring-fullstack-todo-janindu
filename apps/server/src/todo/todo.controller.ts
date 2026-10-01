import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthGuard, RequestUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { handleError } from '../common/handle-error';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  private readonly messages = new MessageBuilder('todo');

  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() body: CreateTodoDto,
    @CurrentUser() user: RequestUser,
  ) {
    try {
      return await this.todoService.create(
        user.id,
        body.title,
        body.description,
      );
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }
}
