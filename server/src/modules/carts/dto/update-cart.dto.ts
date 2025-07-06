import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UpdateCartDto {
    @IsMongoId()
    @IsNotEmpty()
    productId: ObjectId;

    @IsMongoId()
    @IsOptional()
    variantId?: ObjectId;

    @IsNumber()
    @Min(0)
    quantity: number;
}
