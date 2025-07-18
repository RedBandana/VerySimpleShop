import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartState } from '../../store/cart.reducer';
import { Subscription } from 'rxjs';
import { CartDispatchService } from '../../services/cart-dispatch.service';

@Component({
  selector: 'app-cart-icon',
  imports: [RouterModule],
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.scss'
})
export class CartIconComponent {
  cartState?: CartState;
  cartSubscription!: Subscription;
  cartItemCount = 0;

  constructor(
    private cartDispatchService: CartDispatchService,
  ) {
  }

  ngOnInit(): void {
    this.subscribeNgRx();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.cartSubscription = this.cartDispatchService.subscription.subscribe((state) => {
      this.cartState = state;

      if (state.cart) {
        const quantity = state.cart.items.map(i => i.quantity);
        this.cartItemCount = quantity.reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        }, 0);
      }
    });
  }

}
