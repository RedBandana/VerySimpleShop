import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongodb';

export class RemoveFromCartDto {
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
