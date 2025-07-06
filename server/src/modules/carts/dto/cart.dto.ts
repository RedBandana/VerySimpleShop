import { IsNotEmpty, IsNumber, IsArray, IsOptional, ValidateNested, Min, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

export class CartItemDto {
    @IsMongoId()
    @IsNotEmpty()
    productId: ObjectId;

    @IsMongoId()
    @IsOptional()
    variantId?: ObjectId;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CartDto {
    @IsMongoId()
    @IsNotEmpty()
    userId: ObjectId;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];

    @IsNumber()
    @Min(0)
    totalPrice: number;

    @IsMongoId()
    @IsOptional()
    orderId?: ObjectId;
}