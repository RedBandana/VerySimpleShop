import { Body, Controller, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SESSION_COOKIE_NAME } from 'src/common/constants/general.constant';
import { VerifyAccountRequestDto } from './dto/verify-account-request.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResponseUtils } from 'src/common/utils/response.utils';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { IAuthResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('guest')
    async createGuestSession(@Res() res: Response): Promise<void> {
        const user = await this.authService.createGuest();
        const authCookie = this.authService.authenticate(user);
        const authResponse: IAuthResponse = { token: authCookie.token };
        const response = ResponseUtils.success(authResponse, 'Guest session created successfully');

        res.cookie(authCookie.name, authCookie.token, authCookie.options);
        res.status(HttpStatus.OK).json(response);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
        try {
            const user = await this.authService.login(loginDto);
            const authCookie = this.authService.authenticate(user);
            const authResponse: IAuthResponse = { token: authCookie.token };
            const response = ResponseUtils.success(authResponse, 'Login successful');

            res.cookie(authCookie.name, authCookie.token, authCookie.options);
            res.status(HttpStatus.OK).json(response);
        } catch (error) {
            const response = ResponseUtils.error(
                'Login failed',
                'LOGIN_FAILED',
                HttpStatus.UNAUTHORIZED,
                error.message
            );
            res.status(HttpStatus.UNAUTHORIZED).json(response);
        }
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response): Promise<void> {
        try {
            const user = await this.authService.register(registerDto);
            const authCookie = this.authService.authenticate(user);
            const authResponse: IAuthResponse = { token: authCookie.token };
            const response = ResponseUtils.success(authResponse, 'Registration successful');

            res.cookie(authCookie.name, authCookie.token, authCookie.options);
            res.status(HttpStatus.OK).json(response);
        } catch (error) {
            const response = ResponseUtils.error(
                'Registration failed',
                'REGISTRATION_FAILED',
                HttpStatus.BAD_REQUEST,
                error.message
            );
            res.status(HttpStatus.UNAUTHORIZED).json(response);
        }
    }

    @Post('password-reset/request')
    async requestPasswordReset(@Body() resetRequestDto: ResetPasswordRequestDto): Promise<ApiResponse<any>> {
        try {
            const result = await this.authService.requestPasswordReset(resetRequestDto);
            return ResponseUtils.success(result, 'Password reset request sent');
        } catch (error) {
            return ResponseUtils.error(
                'Password reset request failed',
                'PASSWORD_RESET_REQUEST_FAILED',
                HttpStatus.BAD_REQUEST,
                error.message
            );
        }
    }

    @Post('password-reset')
    async resetPassword(@Body() resetDto: ResetPasswordDto): Promise<ApiResponse<any>> {
        try {
            const result = await this.authService.resetPassword(resetDto);
            return ResponseUtils.success(result, 'Password reset successful');
        } catch (error) {
            return ResponseUtils.error(
                'Password reset failed',
                'PASSWORD_RESET_FAILED',
                HttpStatus.BAD_REQUEST,
                error.message
            );
        }
    }

    @Post('verify-account/request')
    async verifyAccountRequest(@Body() verifyAccountRequestDto: VerifyAccountRequestDto): Promise<ApiResponse<any>> {
        try {
            const result = await this.authService.requestAccountVerification(verifyAccountRequestDto);
            return ResponseUtils.success(result, 'Account verification request sent');
        } catch (error) {
            return ResponseUtils.error(
                'Account verification request failed',
                'ACCOUNT_VERIFICATION_REQUEST_FAILED',
                HttpStatus.BAD_REQUEST,
                error.message
            );
        }
    }

    @Post('verify-account/:token')
    async verifyAccount(@Body() verifyAccountDto: VerifyAccountDto): Promise<ApiResponse<any>> {
        try {
            const result = await this.authService.verifyAccount(verifyAccountDto);
            return ResponseUtils.success(result, 'Account verified successfully');
        } catch (error) {
            return ResponseUtils.error(
                'Account verification failed',
                'ACCOUNT_VERIFICATION_FAILED',
                HttpStatus.BAD_REQUEST,
                error.message
            );
        }
    }

    @Post('logout')
    async logout(@Req() req: any, @Res() res: Response): Promise<void> {
        try {
            const token: string = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : "";
            await this.authService.invalidateSession(token);

            res.clearCookie(SESSION_COOKIE_NAME);

            const response = ResponseUtils.success(null, 'Logout successful');
            res.status(HttpStatus.OK).json(response);
        } catch (error) {
            const response = ResponseUtils.error(
                'Logout failed',
                'LOGOUT_FAILED',
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
        }
    }
}
