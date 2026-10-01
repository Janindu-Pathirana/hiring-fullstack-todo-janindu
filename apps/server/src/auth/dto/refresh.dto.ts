import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IRefreshRequestBody } from '@hiring-fullstack-todo-janindu/shared-types';

export class RefreshBodyDto implements IRefreshRequestBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  refreshToken: string;
}
