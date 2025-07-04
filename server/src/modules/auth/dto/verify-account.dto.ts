import {
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';

export class VerifyAccountDto {
    @IsString()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly token: string;
}
