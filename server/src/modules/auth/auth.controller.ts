import { Body, Controller, HttpStatus, Logger, Post, Req, Res, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SESSION_COOKIE_NAME } from 'src/common/constants/general.constant';
import { VerifyAccountRequestDto } from './dto/verify-account-request.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';

@Controller('auth')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(
    new ValidationPipe({
        whitelist: true,
        transform: true,
    }),
)
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('guest')
    async createGuestSession(@Res() res: Response) {
        const user = await this.authService.createGuest();
        const authCookie = this.authService.authenticate(user);

        res.cookie(authCookie.name, authCookie.token, authCookie.options);
        res.status(HttpStatus.OK).json(user);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        this.logger.log(loginDto);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        this.logger.log(registerDto);
    }

    @Post('password-reset/request')
    requestPasswordReset(@Body() resetRequestDto: ResetPasswordRequestDto) {
        this.logger.log(resetRequestDto);
    }

    @Post('password-reset')
    resetPassword(@Body() resetDto: ResetPasswordDto) {
        this.logger.log(resetDto);
    }

    @Post('verify-account/request')
    verifyAccountRequest(@Body() verifyAccountRequestDto: VerifyAccountRequestDto) {
        this.logger.log(verifyAccountRequestDto);
    }

    @Post('verify-account/:token')
    verifyAccount(verifyAccountDto: VerifyAccountDto) {
        this.logger.log(verifyAccountDto);
    }

    @Post('logout')
    async logout(@Req() req: any, @Res() res: Response) {
        const token: string = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : "";
        await this.authService.invalidateSession(token);

        res.clearCookie(SESSION_COOKIE_NAME);
        res.status(HttpStatus.NO_CONTENT).send();
    }
}
