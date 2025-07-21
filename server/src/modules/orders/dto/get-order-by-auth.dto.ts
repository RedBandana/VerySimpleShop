import { IsString } from 'class-validator';

export class GetOrderByAuthDto {
    @IsString()
    orderNumber: string;

    @IsString()
    postalCode: string;
}