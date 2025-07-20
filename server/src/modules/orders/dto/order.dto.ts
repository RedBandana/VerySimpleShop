import { IsNotEmpty, IsEnum, ValidateNested, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { ObjectId } from 'mongodb';
import { ShippingDetailsDto } from './shipping-details.dto';

export class OrderDto {
    @IsMongoId()
    @IsNotEmpty()
    cartId: ObjectId;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @ValidateNested()
    @Type(() => ShippingDetailsDto)
    @IsOptional()
    shippingDetails: ShippingDetailsDto;
}