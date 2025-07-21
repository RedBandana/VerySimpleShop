import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAuthComponent } from './order-auth.component';

describe('OrderAuthComponent', () => {
  let component: OrderAuthComponent;
  let fixture: ComponentFixture<OrderAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
