import {
    IsString,
    IsOptional,
    Length,
} from 'class-validator';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';


export class AddressDto {
    @IsString()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly line1: string;

    @IsOptional()
    @IsString()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly line2?: string;

    @IsString()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly city: string;

    @IsString()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly state: string;

    @IsString()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly country: string;

    @IsString()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly postalCode: string;
}
