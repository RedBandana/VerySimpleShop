export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  guestId?: string;
}

export interface IAuthResponse {
  token: string;
}
