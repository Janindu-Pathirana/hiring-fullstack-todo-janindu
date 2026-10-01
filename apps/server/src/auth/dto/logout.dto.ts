import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ILogoutRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';

export class LogoutBodyDto implements ILogoutRequestBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  refreshToken: string;
}
