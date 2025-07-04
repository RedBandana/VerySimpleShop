import {
    IsEmail,
    IsNotEmpty,
    Length,
} from 'class-validator';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';

export class VerifyAccountRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.EMAIL.MIN, INPUT_LENGTH.EMAIL.MAX)
    readonly email: string;
}
