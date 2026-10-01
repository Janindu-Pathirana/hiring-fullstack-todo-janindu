import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { AuthKitModule } from '../auth/authkit.module';
import { Todo } from '../todo/todo.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [AuthKitModule, TypeOrmModule.forFeature([Todo])],
  controllers: [DashboardController],
  providers: [DashboardService, AuthGuard],
})
export class DashboardModule {}
