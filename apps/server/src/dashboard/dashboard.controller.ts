import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import MessageBuilder from '@janindu-pathirana/message-builder';
import { AuthGuard, RequestUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { handleError } from '../common/handle-error';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  private readonly messages = new MessageBuilder('dashboard');

  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getCounts(@CurrentUser() user: RequestUser) {
    try {
      return await this.dashboardService.getCounts(user.id);
    } catch (error) {
      handleError(
        error,
        new InternalServerErrorException(this.messages.somethingWentWrong()),
      );
    }
  }
}
