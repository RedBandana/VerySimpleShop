import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CartIconComponent } from '../../../../features/carts/components/cart-icon/cart-icon.component';
import { UserDispatchService } from '../../../../features/users/services/user-dispatch.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, FormsModule, CartIconComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  searchTerm = '';
  showSearch = false;
  cartItemCount$!: Observable<number>;

  constructor(
    private router: Router,
    private userDispatchService: UserDispatchService
  ) { }

  get userEmail() {
    return this.userDispatchService.user?.email ?? "";
  }

  onSearchToggle(): void {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchTerm = '';
    }
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchTerm.trim() }
      });
      this.showSearch = false;
      this.searchTerm = '';
    }
  }
}
