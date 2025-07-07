import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';
import { IUser } from './schemas/user.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService extends DatabaseCollectionService {

    constructor(
        @InjectModel(DatabaseModel.USER) protected readonly userModel: Model<IUser>,
    ) {
        super(userModel);
    }

    async get(userId: ObjectId): Promise<IUser> {
        const user: any = await this.getDocument(userId);
        return user;
    }

    async create(user: Partial<IUser>): Promise<IUser> {
        const newUser = await this.createDocument(user);
        return newUser;
    }
}
