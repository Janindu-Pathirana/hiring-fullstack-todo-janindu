import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthKitModule } from '../auth/authkit.module';
import { typeOrmConfig } from '../config/typeorm.config';
import { MessageBuilderModule } from '../messages/message-builder.module';
import { TodoModule } from '../todo/todo.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    AuthKitModule,
    MessageBuilderModule,
    TodoModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
