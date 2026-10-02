import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DATABASE_HOST'),
  port: Number(config.get<string>('DATABASE_PORT')),
  username: config.get<string>('DATABASE_USER'),
  password: config.get<string>('DATABASE_PASSWORD'),
  database: config.get<string>('DATABASE_NAME'),
  autoLoadEntities: true,
  synchronize: false,
});
