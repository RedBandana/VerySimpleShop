import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemAddedComponent } from './cart-item-added.component';

describe('CartItemAddedComponent', () => {
  let component: CartItemAddedComponent;
  let fixture: ComponentFixture<CartItemAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemAddedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
