import { UserPermissions } from "../../../core/enums/user-permissions.enum";
import { UserTypes } from "../../../core/enums/user-types.enum";

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: UserTypes;
  isVerified: boolean;
  permissions: UserPermissions[];
  addresses?: IAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}
