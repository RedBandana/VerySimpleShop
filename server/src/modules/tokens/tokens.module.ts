import { Module } from '@nestjs/common';
import { TokensService as TokensService } from './tokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schemas/token.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';

@Module({
  imports: [MongooseModule.forFeature([{ name: DatabaseModel.TOKEN, schema: TokenSchema }])],
  providers: [TokensService],
  controllers: [],
  exports: [TokensService],
})
export class TokensModule {}
