import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { AuthKitModule } from '../auth/authkit.module';
import { TodoController } from './todo.controller';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Module({
  imports: [AuthKitModule, TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService, AuthGuard],
})
export class TodoModule {}
