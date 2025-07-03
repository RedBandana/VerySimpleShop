import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { Token } from './schemas/token.schema';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';

@Injectable()
export class TokensService extends DatabaseCollectionService {
    constructor(@InjectModel(DatabaseModel.TOKEN) private readonly tokenModel: Model<Token>) {
        super(tokenModel);
    }

    async blacklistToken(token: string, expireAt: Date): Promise<void> {
        await this.tokenModel.create({ token, expireAt });
    }

    async isBlacklisted(token: string): Promise<boolean> {
        const foundToken = await this.tokenModel.findOne({ token }).lean().exec();
        if (!foundToken) return false;

        if (foundToken.expireAt < new Date()) {
            await foundToken.deleteOne();
            return false;
        }

        return true;
    }
}
