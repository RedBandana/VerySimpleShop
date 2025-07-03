import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensModule } from '../tokens/tokens.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DatabaseModel.USER, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    TokensModule,
    MailModule,
  ],
  providers: [UsersService, FormatResponseInterceptor],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
