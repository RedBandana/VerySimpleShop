import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(0)
    quantity: number;
}
