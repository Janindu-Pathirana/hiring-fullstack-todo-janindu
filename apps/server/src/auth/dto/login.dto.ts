import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ILoginRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';

export class LoginBodyDto implements ILoginRequestBody {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  password: string;
}
