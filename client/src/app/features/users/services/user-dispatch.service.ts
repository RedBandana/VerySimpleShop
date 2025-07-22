import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { IUser } from '../models/user.model';
import { UserTypes } from '../../../core/enums/user-types.enum';
import { LogService } from '../../../core/services/log.service';
import { UserPermissions } from '../../../core/enums/user-permissions.enum';
import { UserState } from '../store/user.reducer';
import { resetUserSuccessStates, startGetMe } from '../store/user.actions';
import { CartDispatchService } from '../../carts/services/cart-dispatch.service';

@Injectable({
  providedIn: 'root',
})
export class UserDispatchService {
  private logService: LogService = new LogService(UserDispatchService.name);
  state?: UserState;

  get user(): IUser | undefined {
    return this.state?.user;
  }

  get isUserLogged(): boolean {
    const user = this.state?.user ?? false;
    return user && user.type !== UserTypes.GUEST;
  }

  get hasAnActiveSession() {
    return this.state?.user != null;
  }

  get isAnAdmin() {
    this.logService.log('this.user?.permissions', this.state?.user);
    return this.user?.permissions.includes(UserPermissions.ADMINISTRATOR);
  }

  get subscription() {
    return this.store.select((state) => state.user);
  }

  constructor(
    private store: Store<{ user: UserState }>,
    private cartDispatchService: CartDispatchService,
  ) {
    this.subscribeNgRx();
    this.getMe();
  }

  private subscribeNgRx() {
    this.store
      .select((state) => state.user)
      .subscribe((userState) => {
        if (!userState) return;
        this.state = userState;

        if (this.state.getMeSuccess)
          this.cartDispatchService.getMyCart();

        this.resetUserSuccessStates();
      });
  }

  private resetUserSuccessStates() {
    if (this.state?.success) {
      this.logService.log('resetUserSuccessStates');
      this.store.dispatch(resetUserSuccessStates());
    }
  }

  waitForLoadingToEnd(): Observable<boolean> {
    return this.store
      .select((state) => state.user.loading)
      .pipe(
        filter((loading) => !loading),
        take(1),
      );
  }

  getMe() {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startGetMe');
      this.store.dispatch(startGetMe());
    });
  }
}
