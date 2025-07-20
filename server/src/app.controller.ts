import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseUtils } from './common/utils/response.utils';
import { ApiResponse } from './common/interfaces/api-response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiResponse<string> {
    const message = this.appService.getHello();
    return ResponseUtils.success(message, 'Welcome message retrieved successfully');
  }
}
