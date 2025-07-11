import { Body, Controller, Delete, Get, Logger, Param, Put, Req, UseGuards, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { IUser } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ObjectId } from 'mongodb';
import { ResponseUtil } from 'src/common/utils/response.util';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
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
    getProfile(@Req() req: any): ApiResponse<IUser> {
        return ResponseUtil.success(req.user, 'Profile retrieved successfully');
    }

    @Put('me')
    async updateProfile(@Req() req: any, @Body() updateDto: UpdateUserDto): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const user = await this.usersService.updateDocument(userId, updateDto);
        return ResponseUtil.success(user, 'Profile updated successfully');
    }

    @Get()
    @UseGuards(AdminGuard)
    async getAllUsers(): Promise<ApiResponse<any>> {
        const users = await this.usersService.getAll({});
        return ResponseUtil.success(users, 'Users retrieved successfully');
    }

    @Get(':userId')
    @UseGuards(AdminGuard)
    async getUserById(@Param('userId', ParseObjectIdPipe) userId: ObjectId): Promise<ApiResponse<any>> {
        const user = await this.usersService.get(userId);
        return ResponseUtil.success(user, 'User retrieved successfully');
    }

    @Delete(':userId')
    @UseGuards(AdminGuard)
    async deleteUser(@Param('userId', ParseObjectIdPipe) userId: ObjectId): Promise<ApiResponse<null>> {
        await this.usersService.delete(userId);
        return ResponseUtil.success(null, 'User deleted successfully', HttpStatus.NO_CONTENT);
    }
}
