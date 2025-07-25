import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  createGuestSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.startGuestSession),
      switchMap((_) =>
        this.authService.createGuestSession().pipe(
          map((authResponse) => AuthActions.guestSessionSuccess({ authResponse })),
          catchError((error) => of(AuthActions.guestSessionFailure({ error }))),
        ),
      ),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.startLogin),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map((authResponse) => AuthActions.loginSuccess({ authResponse })),
          catchError((error) => of(AuthActions.loginFailure({ error }))),
        ),
      ),
    ),
  );
  
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.startRegister),
      switchMap(({ request }) =>
        this.authService.register(request).pipe(
          map((authResponse) => AuthActions.registerSuccess({ authResponse })),
          catchError((error) => of(AuthActions.registerFailure({ error }))),
        ),
      ),
    ),
  );
}
