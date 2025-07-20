import { IsNotEmpty, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/common/dto/address.dto';

export class ShippingDetailsDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    address: AddressDto;

    @IsString()
    @IsOptional()
    carrier?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    trackingNumber?: string;
}