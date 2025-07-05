import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CartDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];

    @IsNumber()
    @Min(0)
    totalPrice: number;

    @IsString()
    @IsOptional()
    orderId?: string;
}