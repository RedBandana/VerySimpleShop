import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { IUser } from '../users/schemas/user.schema';
import { UserTypes } from 'src/common/enums/user-types.enum';
import { CookieOptions } from 'express';
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from 'src/common/constants/general.constant';
import { JwtService } from '@nestjs/jwt';
import { HOURS_IN_DAY, HOURS_IN_MS, MS_IN_SEC } from 'src/common/constants/time.constant';
import { getBaseDomain } from 'src/common/utils/functions.utils';
import { IAuthCookie } from './interfaces/auth-cookie.interface';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyAccountRequestDto } from './dto/verify-account-request.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        protected jwtService: JwtService,
        protected usersService: UsersService,
        protected tokensService: TokensService,
    ) {
    }

    authenticate(user: IUser): IAuthCookie {
        const token = this.jwtService.sign({ userId: user._id }, { expiresIn: `${SESSION_DURATION_DAYS}d` });
        const options = this.getCookieOptions();
        const authCookie: IAuthCookie = { name: SESSION_COOKIE_NAME, token, options }
        return authCookie;
    }

    async invalidateSession(token: string): Promise<void> {
        if (!token) return;

        const decoded = this.jwtService.decode(token);
        const expireAt = new Date(decoded.exp * MS_IN_SEC);
        await this.tokensService.blacklistToken(token, expireAt);
    }

    async createGuest(): Promise<IUser> {
        const guest = await this.usersService.createDocument({ type: UserTypes.GUEST });
        return guest;
    }

    async login(loginDto: LoginDto): Promise<{ user: IUser; token: string }> {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ userId: user._id }, { expiresIn: `${SESSION_DURATION_DAYS}d` });
        
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword as IUser, token };
    }

    async register(registerDto: RegisterDto): Promise<{ user: IUser; message: string }> {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.createDocument({
            ...registerDto,
            password: hashedPassword,
            type: UserTypes.REGISTERED,
        });

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword as IUser, message: 'User registered successfully' };
    }

    async requestPasswordReset(dto: ResetPasswordRequestDto): Promise<{ message: string }> {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            return { message: 'If the email exists, a password reset link has been sent' };
        }

        return { message: 'If the email exists, a password reset link has been sent' };
    }

    async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        
        return { message: 'Password reset successfully' };
    }

    async requestAccountVerification(dto: VerifyAccountRequestDto): Promise<{ message: string }> {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            return { message: 'If the email exists, a verification link has been sent' };
        }

        return { message: 'If the email exists, a verification link has been sent' };
    }

    async verifyAccount(dto: VerifyAccountDto): Promise<{ message: string }> {
        return { message: 'Account verified successfully' };
    }

    getCookieOptions(): CookieOptions {
        const cookieOptions: CookieOptions = {
            httpOnly: true, // The cookie cannot be accessed or manipulated from the client-side JS
            path: '/', //  the cookie will only be sent by the browser when the user is visiting a page under the path (e.g., mysite.com/${path})
            sameSite: 'none', // The cookie will be sent with both same-site and cross-site requests since the request initiator's site (mysite.com) is different from the server's site (server.mysite.com)
            secure: true,
            maxAge: SESSION_DURATION_DAYS * HOURS_IN_DAY * HOURS_IN_MS,
        };

        const domain = getBaseDomain(process.env.FRONTEND_URL ?? "");
        if (domain) cookieOptions.domain = domain;

        return cookieOptions;
    }

}
