import { hash as bcryptHash } from 'bcryptjs';
import { PASSWORD_SALT } from "src/common/constants/general.constant";
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import mongoose, { Schema } from "mongoose";
import { INPUT_LENGTH } from "src/common/constants/input.constant";
import { UserTypes } from "src/common/enums/user-types.enum";
import { emailValidator } from "src/common/utils/functions.utils";
import { Address, AddressSchema } from "../../../common/schemas/address.schema";
import { UserPermissions } from 'src/common/enums/user-permissions.enum';
import { ObjectId } from 'mongodb';

export interface User extends Document {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;

    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address;
    password: string;
    type: UserTypes;
    isVerified: boolean;
    permissions: UserPermissions[];
}

export const UserSchema = new Schema(
    {
        email: {
            type: String,
            minlength: INPUT_LENGTH.EMAIL.MIN,
            maxlength: INPUT_LENGTH.EMAIL.MAX,
            validate: [emailValidator, 'Please fill a valid email address'],
            required: [
                function () {
                    return this.type !== UserTypes.GUEST;
                },
                'Email is required',
            ],
        },
        password: {
            type: String,
            minlength: INPUT_LENGTH.PASSWORD.MIN,
            maxlength: INPUT_LENGTH.PASSWORD.MAX,
            required: [
                function () {
                    return this.type !== UserTypes.GUEST;
                },
                'Password is required',
            ],
        },
        type: { type: String, enum: UserTypes, default: UserTypes.GUEST, required: true },
        firstName: { type: String, minlength: INPUT_LENGTH.NAME.MIN, maxlength: INPUT_LENGTH.NAME.MAX },
        lastName: { type: String, minlength: INPUT_LENGTH.NAME.MIN, maxlength: INPUT_LENGTH.NAME.MAX },
        phone: { type: String, minlength: INPUT_LENGTH.PHONE.MIN, maxlength: INPUT_LENGTH.PHONE.MAX },
        address: { type: AddressSchema },
        isVerified: { type: Boolean },
        permissions: { type: [String], enum: UserPermissions, default: [] },
    },
    {
        timestamps: true,
    },
);

UserSchema.index(
    { email: 1 },
    {
        unique: true,
        sparse: true,
        partialFilterExpression: {
            email: {
                $and: [
                    { $exists: true },
                    { $ne: null },
                    { $ne: '' }
                ]
            }
        },
    },
);

async function preUpdate(next: any) {
    try {
        const update: any = this.getUpdate();
        if (update.password) {
            const hashed = await bcryptHash(update.password, PASSWORD_SALT);
            update.password = hashed;
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

async function preSave(next: any) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await bcryptHash(this['password'], PASSWORD_SALT);
        this['password'] = hashed;

        return next();
    } catch (err) {
        return next(err);
    }
}

UserSchema.pre('findOneAndReplace', preUpdate);
UserSchema.pre('findOneAndUpdate', preUpdate);
UserSchema.pre('replaceOne', preUpdate);
UserSchema.pre('updateOne', preUpdate);
UserSchema.pre('updateMany', preUpdate);
UserSchema.pre('save', preSave);

export const UserModel = mongoose.model<User>(DatabaseModel.USER, UserSchema);
