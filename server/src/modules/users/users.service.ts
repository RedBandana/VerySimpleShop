import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';
import { TokensService } from '../tokens/tokens.service';
import { MailService } from '../mail/mail.service';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService extends DatabaseCollectionService {

    constructor(
        @InjectModel(DatabaseModel.USER) protected readonly userModel: Model<User>,
        protected jwtService: JwtService,
        protected tokensService: TokensService,
        protected mailService: MailService,
        protected readonly i18n: I18nService,
    ) {
        super(userModel);
    }

    async get(userId: ObjectId): Promise<User> {
        const user: any = await this.getDocumentByIdLean(userId);
        return user;
    }
}
