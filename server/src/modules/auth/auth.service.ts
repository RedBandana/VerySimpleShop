import { Injectable } from '@nestjs/common';
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
