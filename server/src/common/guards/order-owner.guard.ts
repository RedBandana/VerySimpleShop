import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { OrdersService } from 'src/modules/orders/orders.service';

@Injectable()
export class OrderOwnerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private ordersService: OrdersService,
        private i18n: I18nService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const orderId = request.params.orderId;
        const orderNumber = request.params.orderNumber;
        const userId = request.user._id;

        if (!orderId && !orderNumber) {
            const unauthorized = this.i18n.translate("general.errors.unauthorized", { lang: I18nContext.current()?.lang });
            throw new UnauthorizedException(unauthorized);
        }

        const order = orderId ? await this.ordersService.get(orderId) : await this.ordersService.getByNumber(orderNumber);
        if (!order || order.userId.toString() != userId.toString()) {
            const unauthorized = this.i18n.translate("general.errors.unauthorized", { lang: I18nContext.current()?.lang });
            throw new UnauthorizedException(unauthorized);
        }

        return true;
    }
}