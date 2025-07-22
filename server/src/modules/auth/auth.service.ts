import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { IUser } from '../users/schemas/user.schema';
import { UserTypes } from 'src/common/enums/user-types.enum';
import { CookieOptions } from 'express';
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from 'src/common/constants/general.constant';
import { JwtService } from '@nestjs/jwt';
import { HOURS_IN_DAY, HOURS_IN_MS, MS_IN_SEC } from 'src/common/constants/time.constant';
import { getBaseDomain } from 'src/common/utils/functions.utils';
import { IAuthCookie } from './interfaces/auth.interface';
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

    private readonly logger = new Logger(AuthService.name);

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

    async login(loginDto: LoginDto): Promise<IUser> {
        const user = await this.usersService.getByEmail(loginDto.email.trim().toLowerCase());
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        delete user.password;
        return user;
    }

    async register(registerDto: RegisterDto): Promise<IUser> {
        const existingUser = await this.usersService.getByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('A user with this email already exists');
        }

        const { guestId, ...update } = registerDto;
        update.email = update.email.trim().toLowerCase();

        if (guestId) {
            const guestUser = await this.usersService.filterOneBy({
                _id: guestId,
                type: UserTypes.GUEST
            });
            
            if (!guestUser)
                throw new NotFoundException("No valid guest session associated with the login");

            const updatedUser = await this.usersService.updateDocument(guestId, {
                ...update,
                type: UserTypes.REGISTERED,
            });

            delete updatedUser.password;
            return updatedUser;
        }

        const newUser = await this.usersService.createDocument({
            ...update,
            type: UserTypes.REGISTERED,
        });

        delete newUser.password;
        return newUser;
    }

    async requestPasswordReset(dto: ResetPasswordRequestDto): Promise<{ message: string }> {
        const user = await this.usersService.getByEmail(dto.email);
        if (!user) {
            return { message: 'If the email exists, a password reset link has been sent' };
        }

        return { message: 'If the email exists, a password reset link has been sent' };
    }

    async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        return { message: 'Password reset successfully' };
    }

    async requestAccountVerification(dto: VerifyAccountRequestDto): Promise<{ message: string }> {
        const user = await this.usersService.getByEmail(dto.email);
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
