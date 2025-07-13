import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartFacadeService } from '../../../../features/carts/services/cart-facade.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  searchTerm = '';
  showSearch = false;
  cartItemCount$!: Observable<number>;

  constructor(
    private cartFacade: CartFacadeService,
    private router: Router
  ) {
    this.cartItemCount$ = this.cartFacade.cart$.pipe(
      map(cart => cart?.totalItems || 0)
    );
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
