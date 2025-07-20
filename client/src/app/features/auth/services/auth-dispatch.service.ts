import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { IUser } from '../../users/models/user.model';
import { UserTypes } from '../../../core/enums/user-types.enum';
import { resetAuthSuccessStates, startGuestSession } from '../store/auth.actions';
import { AuthState } from '../store/auth.reducer';
import { LogService } from '../../../core/services/log.service';
import { UserPermissions } from '../../../core/enums/user-permissions.enum';
import { UserDispatchService } from '../../users/services/user-dispatch.service';
import { CartDispatchService } from '../../carts/services/cart-dispatch.service';

@Injectable({
  providedIn: 'root',
})
export class AuthDispatchService {
  private logService: LogService = new LogService(AuthDispatchService.name);
  state?: AuthState;

  get subscription() {
    return this.store.select((state) => state.auth);
  }

  constructor(
    private store: Store<{ auth: AuthState }>,
    private userDispatchService: UserDispatchService,
  ) {
    this.subscribeNgRx();
  }

  private subscribeNgRx() {
    this.store
      .select((state) => state.auth)
      .subscribe((authState) => {
        if (!authState) return;
        this.state = authState;

        if (this.state.guestSessionSuccess)
          this.userDispatchService.getMe();

        this.resetAuthSuccessStates();
      });
  }

  private resetAuthSuccessStates() {
    if (this.state?.success) {
      this.logService.log('resetAuthSuccessStates');
      this.store.dispatch(resetAuthSuccessStates());
    }
  }

  private waitForLoadingToEnd(): Observable<boolean> {
    return this.store
      .select((state) => state.auth.loading)
      .pipe(
        filter((loading) => !loading),
        take(1),
      );
  }

  createGuestSession() {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startGuestSession');
      this.store.dispatch(startGuestSession());
    });
  }
}
