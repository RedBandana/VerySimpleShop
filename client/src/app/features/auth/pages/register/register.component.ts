import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthDispatchService } from '../../services/auth-dispatch.service';
import { Router, RouterModule } from '@angular/router';
import { UserDispatchService } from '../../../users/services/user-dispatch.service';
import { UserTypes } from '../../../../core/enums';
import { IRegisterRequest } from '../../models/auth-request.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterPage {

  email: string = "";
  password: string = "";
  passwordVisible: boolean = false;
  confirmPassword: string = "";
  confirmPasswordVisible: boolean = false;

  error: string = "";
  loading: boolean = false;

  authSubscription!: Subscription;

  constructor(
    private authDispatchService: AuthDispatchService,
    private userDispatchService: UserDispatchService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subscribeNgRx();
    this.authDispatchService.resetOrderError();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.authSubscription = this.authDispatchService.subscription.subscribe((state) => {
      this.error = state.error ?? "";
      this.loading = state.loading;
      
      if (state.registerSuccess)
        this.router.navigate(['/']);
    });
  }

  handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        this.register();
        break;
    }
  }

  register() {
    if (!this.email || !this.password || !this.confirmPassword) return;
    if (this.password != this.confirmPassword) {
      this.error = "Your passwords don't match";
      return;
    }

    const request: IRegisterRequest = { email: this.email, password: this.password };
    if (this.userDispatchService.user?.type === UserTypes.GUEST)
      request.guestId = this.userDispatchService.user._id;

    this.authDispatchService.register(request);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
