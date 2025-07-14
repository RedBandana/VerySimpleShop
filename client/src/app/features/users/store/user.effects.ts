import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  createGuestSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.startGetMe),
      mergeMap((_) =>
        this.userService.getMe().pipe(
          map((user) => UserActions.getMeSuccess({ user })),
          catchError((error) => of(UserActions.getMeFailure({ error }))),
        ),
      ),
    ),
  );
}
