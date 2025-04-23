import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreateOrderComponent } from './add-create-order.component';

describe('AddCreateOrderComponent', () => {
  let component: AddCreateOrderComponent;
  let fixture: ComponentFixture<AddCreateOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCreateOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCreateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
