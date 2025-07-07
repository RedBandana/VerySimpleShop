import { Body, Controller, Delete, Get, Logger, Param, Put, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { IUser } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ObjectId } from 'mongodb';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(
    new ValidationPipe({
        whitelist: true,
        transform: true,
    }),
)
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Get('me')
    getProfile(@Req() req: any): IUser {
        return req.user;
    }

    @Put('me')
    updateProfile(@Body() updateDto: UpdateUserDto) {
        this.logger.log(updateDto);
    }

    @Get()
    @UseGuards(AdminGuard)
    getAllUsers() {

    }

    @Get(':userId')
    @UseGuards(AdminGuard)
    getUserById(@Param('userId', ParseObjectIdPipe) userId: ObjectId) {
        this.logger.log(userId);
    }

    @Delete(':userId')
    @UseGuards(AdminGuard)
    deleteUser(@Param('userId', ParseObjectIdPipe) userId: ObjectId) {
        this.logger.log(userId);
    }
}
