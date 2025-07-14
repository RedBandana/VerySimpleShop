import { createAction, props } from '@ngrx/store';
import { IAuthResponse } from '../models/auth-request.model';

export const resetAuthSuccessStates = createAction('[Auth] Reset User Success State');

export const startGuestSession = createAction('[Auth] Start Guest Sesion');

export const guestSessionSuccess = createAction('[Auth] Guest Session Success', props<{ authResponse: IAuthResponse }>());

export const guestSessionFailure = createAction('[Auth] Guest Session Failure', props<{ error: string }>());
