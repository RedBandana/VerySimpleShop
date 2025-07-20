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

    async getByEmail(email: string): Promise<IUser | null> {
        const user = await this.userModel.findOne({ email }).exec();
        return user;
    }

    async getAll(params: any): Promise<IUser[]> {
        const users = await this.userModel.find(params).exec();
        return users;
    }

    async delete(userId: ObjectId): Promise<void> {
        await this.userModel.findByIdAndDelete(userId).exec();
    }
}
