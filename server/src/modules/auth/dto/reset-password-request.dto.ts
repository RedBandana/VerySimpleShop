import {
    IsEmail,
    IsNotEmpty,
    Length,
} from 'class-validator';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';

export class ResetPasswordRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.EMAIL.MIN, INPUT_LENGTH.EMAIL.MAX)
    readonly email: string;
}
