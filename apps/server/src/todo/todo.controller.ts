import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthGuard, RequestUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { handleError } from '../common/handle-error';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('todo')
@UseGuards(AuthGuard)
export class TodoController {
  private readonly messages = new MessageBuilder('todo');

  constructor(private readonly todoService: TodoService) {}

  @Post()
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

  @Get()
  async findAll(@CurrentUser() user: RequestUser) {
    try {
      return await this.todoService.findAll(user.id);
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param() params: GetTodoDto,
    @CurrentUser() user: RequestUser,
  ) {
    try {
      return await this.todoService.findOne(user.id, params.id);
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  @Patch(':id')
  async update(
    @Param() params: GetTodoDto,
    @Body() body: UpdateTodoDto,
    @CurrentUser() user: RequestUser,
  ) {
    try {
      return await this.todoService.update(user.id, params.id, body);
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }

  @Delete(':id')
  async remove(
    @Param() params: GetTodoDto,
    @CurrentUser() user: RequestUser,
  ) {
    try {
      return await this.todoService.remove(user.id, params.id);
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }
}
