import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class PrivateGuard implements CanActivate {
  private readonly logger = new Logger(PrivateGuard.name);

  constructor(
    private reflector: Reflector,
    private i18n: I18nService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?._id ?? '';

    const logMessage = userId ? `Unauthorized request from ${userId}` : 'Unauthorized request';
    this.logger.warn(logMessage);

    const errorMessage = this.i18n.translate('general.errors.unauthorized', { lang: I18nContext.current()?.lang });
    throw new UnauthorizedException(errorMessage);
  }
}
