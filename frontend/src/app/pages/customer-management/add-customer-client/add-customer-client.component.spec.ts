import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerClientComponent } from './add-customer-client.component';

describe('AddCustomerClientComponent', () => {
  let component: AddCustomerClientComponent;
  let fixture: ComponentFixture<AddCustomerClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
