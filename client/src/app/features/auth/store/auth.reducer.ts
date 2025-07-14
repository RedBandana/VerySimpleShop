import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { IAuthResponse } from '../models/auth-request.model';

export interface AuthState {
  auth?: IAuthResponse;
  error?: string;
  loading: boolean;
  guestSessionSuccess: boolean;
  loginSuccess: boolean;
  logoutSuccess: boolean;
  registerSuccess: boolean;
  success: boolean;
}

export const initialState: AuthState = {
  auth: undefined,
  error: undefined,
  loading: false,
  guestSessionSuccess: false,
  loginSuccess: false,
  logoutSuccess: false,
  registerSuccess: false,
  success: false
}

export const authReducer = createReducer(
  initialState,

  on(AuthActions.resetAuthSuccessStates, (state) => ({
    ...state,
    success: false,
    guestSessionSuccess: false,
    loginSuccess: false,
    logoutSuccess: false,
    registerSuccess: false,
  })),

  on(AuthActions.startGuestSession, (state) => ({
    ...state,
    guestSessionSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(AuthActions.guestSessionSuccess, (state, { authResponse }) => ({
    ...state,
    auth: authResponse,
    loading: false,
    error: undefined,
    success: true,
    guestSessionSuccess: true,
  })),

  on(AuthActions.guestSessionFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    guestSessionSuccess: false,
  })),
);
