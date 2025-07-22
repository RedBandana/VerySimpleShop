import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthDispatchService } from '../../services/auth-dispatch.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  email: string = "";
  password: string = "";
  passwordVisible: boolean = false;
  error: string = "";
  loading: boolean = false;

  authSubscription!: Subscription;

  constructor(
    private authDispatchService: AuthDispatchService,
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
      if (state.loginSuccess)
        this.router.navigate(['/']);
    });
  }

  handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        this.login();
        break;
    }
  }

  login() {
    if (!this.email || !this.password) return;

    this.authDispatchService.login({
      email: this.email,
      password: this.password
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
