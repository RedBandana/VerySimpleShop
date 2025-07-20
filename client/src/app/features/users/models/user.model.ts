import { UserPermissions } from "../../../core/enums/user-permissions.enum";
import { UserTypes } from "../../../core/enums/user-types.enum";
import { IAddress } from "../../../core/interfaces/address.interface";

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: UserTypes;
  isVerified: boolean;
  permissions: UserPermissions[];
  address?: IAddress;
  createdAt: string;
  updatedAt: string;
}

