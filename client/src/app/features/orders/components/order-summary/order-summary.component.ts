import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IOrder } from '../../models/order.model';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {

  @Input() order!: IOrder;

  get shippingAddress() {
    if (!this.order.shippingDetails?.address) return "";

    const { line1, line2, city, state, postalCode, country } = this.order.shippingDetails.address;
    const address = `${line1},${line2 ? ` ${line2}` : ``} ${city}, ${state}, ${postalCode}, ${country}`;
    return address;
  }
}
