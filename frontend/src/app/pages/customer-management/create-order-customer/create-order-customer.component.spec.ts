import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderCustomerComponent } from './create-order-customer.component';

describe('CreateOrderCustomerComponent', () => {
  let component: CreateOrderCustomerComponent;
  let fixture: ComponentFixture<CreateOrderCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrderCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
