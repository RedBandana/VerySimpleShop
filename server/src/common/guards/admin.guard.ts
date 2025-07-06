import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UserPermissions } from '../enums/user-permissions.enum';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private i18n: I18nService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        return true;
        
        const request = context.switchToHttp().getRequest();
        const isAdmin = request.user?.permissions?.includes(UserPermissions.ADMINISTRATOR) ?? false;

        if (!isAdmin) {
            const unauthorized = this.i18n.translate("general.errors.unauthorized", { lang: I18nContext.current()?.lang });
            throw new UnauthorizedException(unauthorized);
        }

        return true;
    }
}