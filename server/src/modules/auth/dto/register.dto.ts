import {
    IsString,
    IsEmail,
    IsNotEmpty,
    Length,
    IsOptional,
    IsMongoId,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { INPUT_LENGTH } from 'src/common/constants/input.constant';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.EMAIL.MIN, INPUT_LENGTH.EMAIL.MAX)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Length(INPUT_LENGTH.PASSWORD.MIN, INPUT_LENGTH.PASSWORD.MAX)
    readonly password: string;

    @IsMongoId()
    @IsOptional()
    @Length(INPUT_LENGTH.TEXT.MIN, INPUT_LENGTH.TEXT.MAX)
    readonly guestId?: ObjectId;
}
