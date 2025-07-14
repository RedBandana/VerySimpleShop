import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { IUser } from '../models/user.model';

export interface UserState {
  user?: IUser;
  error?: string;
  loading: boolean;
  getMeSuccess: boolean;
  success: boolean;
}

export const initialState: UserState = {
  user: undefined,
  error: undefined,
  loading: false,
  getMeSuccess: false,
  success: false
}

export const userReducer = createReducer(
  initialState,

  on(UserActions.resetUserSuccessStates, (state) => ({
    ...state,
    success: false,
    getMeSuccess: false,
  })),

  on(UserActions.startGetMe, (state) => ({
    ...state,
    getMeSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(UserActions.getMeSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: undefined,
    success: true,
    getMeSuccess: true,
  })),

  on(UserActions.getMeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    getMeSuccess: false,
  })),
);
