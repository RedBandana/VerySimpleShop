import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartDispatchService } from '../../services/cart-dispatch.service';

@Component({
  selector: 'app-cart-item-added',
  imports: [],
  templateUrl: './cart-item-added.component.html',
  styleUrl: './cart-item-added.component.scss'
})
export class CartItemAddedComponent implements OnInit, OnDestroy {
  cartSubscription!: Subscription;
  displayShowMessage: boolean = false;

  constructor(
    private cartDispatchService: CartDispatchService,
  ) { }

  ngOnInit(): void {
    this.subscribeNgRx();
  }
  
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.cartSubscription = this.cartDispatchService.subscription.subscribe((state) => {
      if (state.addToCartSuccess) {
        this.displayShowMessage = true;
        setTimeout(() => { this.displayShowMessage = false; }, 1500);
      }
    });
  }
}
