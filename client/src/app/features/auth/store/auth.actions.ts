import { createAction, props } from '@ngrx/store';
import { IAuthResponse, ILoginRequest, IRegisterRequest } from '../models/auth-request.model';

export const resetAuthSuccessStates = createAction('[Auth] Reset User Success State');

export const resetAuthError = createAction('[Auth] Reset Auth Error');

export const startGuestSession = createAction('[Auth] Start Guest Sesion');

export const guestSessionSuccess = createAction('[Auth] Guest Session Success', props<{ authResponse: IAuthResponse }>());

export const guestSessionFailure = createAction('[Auth] Guest Session Failure', props<{ error: string }>());

export const startLogin = createAction('[Auth] Start Log In', props<{ request: ILoginRequest }>());

export const loginSuccess = createAction('[Auth] Log In Success', props<{ authResponse: IAuthResponse }>());

export const loginFailure = createAction('[Auth] Log In Failure', props<{ error: string }>());

export const startRegister = createAction('[Auth] Start Register', props<{ request: IRegisterRequest }>());

export const registerSuccess = createAction('[Auth] Register Success', props<{ authResponse: IAuthResponse }>());

export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());
