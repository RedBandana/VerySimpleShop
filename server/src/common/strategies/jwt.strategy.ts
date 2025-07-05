import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersService } from 'src/modules/users/users.service';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { DatabaseModel } from '../enums/database-model.enum';
import { SESSION_COOKIE_NAME } from '../constants/general.constant';
import { User } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private i18n: I18nService,
  ) {
    const strategyOptions: any = {
      jwtFromRequest: (req: Request) => {
        return this.extractJwtFromRequestCookie(req);
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    };

    super(strategyOptions);
  }

  async validate(req: Request, payload: any): Promise<User> {
    const authToken = this.extractJwtFromRequestCookie(req);

    if (!authToken || await this.tokensService.isBlacklisted(authToken)) {
      const unauthorized = this.i18n.translate('general.errors.unauthorized', { lang: I18nContext.current()?.lang });
      throw new UnauthorizedException(unauthorized);
    }

    const user = await this.usersService.getDocument(payload.userId);
    if (!user) {
      const notFound = this.i18n.translate('general.errors.notFound', {
        args: { model: DatabaseModel.USER },
        lang: I18nContext.current()?.lang,
      });
      throw new UnauthorizedException(notFound);
    }

    return user;
  }

  extractJwtFromRequestCookie(req: Request): string {
    const token: string = req && req.cookies ? req.cookies[SESSION_COOKIE_NAME] : "";
    return token;
  }

  extractJwtFromAuthHeaderAsBearerToken() {
    return ExtractJwt.fromAuthHeaderAsBearerToken();
  }
}
