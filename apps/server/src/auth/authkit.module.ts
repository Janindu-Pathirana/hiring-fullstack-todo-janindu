import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthKitService } from './authkit.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthKitService, AuthService],
  exports: [AuthKitService],
})
export class AuthKitModule {}
