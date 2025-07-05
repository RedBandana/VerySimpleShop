import { IsString, IsNotEmpty, IsEnum, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    streetAddress01: string;

    @IsString()
    @IsOptional()
    streetAddress02?: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    province: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    postalCode: string;
}

export class OrderDto {
    @IsString()
    @IsNotEmpty()
    cartId: string;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    shippingAddress?: AddressDto;
}