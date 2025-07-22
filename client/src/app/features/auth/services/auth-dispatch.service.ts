import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { IUser } from '../../users/models/user.model';
import { UserTypes } from '../../../core/enums/user-types.enum';
import { resetAuthError, resetAuthSuccessStates, startGuestSession, startLogin, startRegister } from '../store/auth.actions';
import { AuthState } from '../store/auth.reducer';
import { LogService } from '../../../core/services/log.service';
import { UserPermissions } from '../../../core/enums/user-permissions.enum';
import { UserDispatchService } from '../../users/services/user-dispatch.service';
import { CartDispatchService } from '../../carts/services/cart-dispatch.service';
import { ILoginRequest, IRegisterRequest } from '../models/auth-request.model';

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

        if (this.state.guestSessionSuccess || this.state.loginSuccess)
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

  resetOrderError() {
    if (this.state?.error) {
      this.logService.log('resetAuthError');
      this.store.dispatch(resetAuthError());
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

  login(request: ILoginRequest) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startLogin');
      this.store.dispatch(startLogin({ request }));
    });
  }

  register(request: IRegisterRequest) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startRegister');
      this.store.dispatch(startRegister({ request }));
    });
  }
}
