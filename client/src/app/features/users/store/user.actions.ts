import { createAction, props } from '@ngrx/store';
import { IUser } from '../models/user.model';

export const resetUserSuccessStates = createAction('[User] Reset User Success State');

export const startGetMe = createAction('[User] Start Get Me Sesion');

export const getMeSuccess = createAction('[User] Get Me Success', props<{ user: IUser }>());

export const getMeFailure = createAction('[User] Get Me Failure', props<{ error: string }>());
