import {
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly token: string;

    @IsString()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.PASSWORD.MIN, INPUT_LENGTH.PASSWORD.MAX)
    readonly password: string;
}
