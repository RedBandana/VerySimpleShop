import { IsOptional, IsNumber, Min, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

export class GetCartsDto {
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
    userId?: ObjectId;

    @IsOptional()
    @IsMongoId()
    orderId?: ObjectId;
}