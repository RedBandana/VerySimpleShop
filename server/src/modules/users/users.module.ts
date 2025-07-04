import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DatabaseModel.USER, schema: UserSchema }]),
  ],
  providers: [UsersService, FormatResponseInterceptor],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
