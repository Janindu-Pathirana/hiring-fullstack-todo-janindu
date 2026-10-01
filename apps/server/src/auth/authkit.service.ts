import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthKit,
  consoleLogger,
  createAuthKit,
  createMemoryRateLimiter,
} from '@janindu-pathirana/authkit';
import MessageBuilder from '@janindu-pathirana/message-builder';

@Injectable()
export class AuthKitService implements OnModuleInit, OnModuleDestroy {
  private kit!: AuthKit;

  private readonly messageBuilder = new MessageBuilder('auth kit');

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const connectionString = this.config.get<string>('DATABASE_URL');
    const jwtSecret = this.config.get<string>('AUTHKIT_JWT_SECRET');

    if (!connectionString || !jwtSecret) {
      throw new Error(
        this.messageBuilder.error(
          'initialize',
          'DATABASE_URL and AUTHKIT_JWT_SECRET are required.',
        ),
      );
    }

    this.kit = createAuthKit({
      connectionString,
      jwtSecret,
      logger: consoleLogger,
      rateLimiter: createMemoryRateLimiter(),
    });

    await this.kit.connect();
    await this.kit.migrate();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kit?.close();
  }

  get client(): AuthKit {
    return this.kit;
  }
}
