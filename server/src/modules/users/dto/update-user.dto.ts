import {
    IsString,
    IsOptional,
    Length,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';
import { AddressDto } from '../../../common/dto/address.dto';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(INPUT_LENGTH.NAME.MIN, INPUT_LENGTH.NAME.MAX)
    readonly firstName?: string;

    @IsOptional()
    @IsString()
    @Length(INPUT_LENGTH.NAME.MIN, INPUT_LENGTH.NAME.MAX)
    readonly lastName?: string;

    @IsOptional()
    @IsString()
    @Length(INPUT_LENGTH.PHONE.MIN, INPUT_LENGTH.PHONE.MAX)
    readonly phone?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    readonly address?: AddressDto;
}
