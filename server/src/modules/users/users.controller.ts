import { Body, Controller, Delete, Get, Logger, Param, Put, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

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
    getProfile(@Req() req: any): User {
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

    @Get(':id')
    @UseGuards(AdminGuard)
    getUserById(@Param('id') id: string) {
        this.logger.log(id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    deleteUser(@Param('id') id: string) {
        this.logger.log(id);
    }
}
