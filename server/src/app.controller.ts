import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseUtil } from './common/utils/response.util';
import { ApiResponse } from './common/interfaces/api-response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiResponse<string> {
    const message = this.appService.getHello();
    return ResponseUtil.success(message, 'Welcome message retrieved successfully');
  }
}
