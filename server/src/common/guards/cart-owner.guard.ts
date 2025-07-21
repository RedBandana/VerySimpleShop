import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CartsService } from 'src/modules/carts/carts.service';

@Injectable()
export class CartOwnerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private cartsService: CartsService,
        private i18n: I18nService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const cartId = request.params.cartId;
        const userId = request.user._id;

        if (!cartId) {
            const unauthorized = this.i18n.translate("general.errors.unauthorized", { lang: I18nContext.current()?.lang });
            throw new UnauthorizedException(unauthorized);
        }

        const cart = await this.cartsService.get(cartId);
        if (!cart || cart.userId.toString() != userId.toString()) {
            const unauthorized = this.i18n.translate("general.errors.unauthorized", { lang: I18nContext.current()?.lang });
            throw new UnauthorizedException(unauthorized);
        }

        return true;
    }
}