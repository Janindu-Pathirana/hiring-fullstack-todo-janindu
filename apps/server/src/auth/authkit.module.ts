import { Module } from '@nestjs/common';
import { AuthKitService } from './authkit.service';

@Module({
  providers: [AuthKitService],
  exports: [AuthKitService],
})
export class AuthKitModule {}
