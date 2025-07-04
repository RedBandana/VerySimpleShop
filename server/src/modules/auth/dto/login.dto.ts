import {
    IsString,
    IsEmail,
    IsNotEmpty,
    Length,
} from 'class-validator';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.EMAIL.MIN, INPUT_LENGTH.EMAIL.MAX)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.PASSWORD.MIN, INPUT_LENGTH.PASSWORD.MAX)
    readonly password: string;
}