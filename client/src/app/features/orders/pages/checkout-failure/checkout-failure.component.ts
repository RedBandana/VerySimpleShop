import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout-failure',
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-failure.component.html',
  styleUrl: './checkout-failure.component.scss'
})
export class CheckoutFailure implements OnInit {
  errorMessage: string = 'Your payment could not be processed. Please try again.';
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get error details from query parameters if provided
    const error = this.route.snapshot.queryParamMap.get('error');
    const errorMessage = this.route.snapshot.queryParamMap.get('error_message');
    
    if (errorMessage) {
      this.errorMessage = decodeURIComponent(errorMessage);
    }
  }
}