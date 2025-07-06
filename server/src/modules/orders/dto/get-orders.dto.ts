import { IsOptional, IsNumber, Min, IsEnum, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { ObjectId } from 'mongodb';

export class GetOrdersDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsMongoId()
    cartId?: ObjectId;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;

    @IsOptional()
    @IsMongoId()
    userId?: ObjectId;
}