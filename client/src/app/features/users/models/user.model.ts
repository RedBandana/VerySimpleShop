export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isGuest: boolean;
  isVerified: boolean;
  permissions: string[];
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

export interface IAuthResponse {
  user: IUser;
  token?: string;
}