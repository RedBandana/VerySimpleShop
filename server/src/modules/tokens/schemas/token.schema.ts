import mongoose, { Document } from 'mongoose';
import { SEC_IN_HOUR } from 'src/common/constants/time.constant';
import { DatabaseModel } from 'src/common/enums/database-model.enum';

export interface Token extends Document {
  token: string;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      index: true,
      unique: true,
    },
    expireAt: {
      type: Date,
      index: { expires: SEC_IN_HOUR },
    },
  },
  {
    timestamps: true,
  },
);

export const TokenModel = mongoose.model<Token>(DatabaseModel.TOKEN, TokenSchema);
