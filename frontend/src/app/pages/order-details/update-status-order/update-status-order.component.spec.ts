import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusOrderComponent } from './update-status-order.component';

describe('UpdateStatusOrderComponent', () => {
  let component: UpdateStatusOrderComponent;
  let fixture: ComponentFixture<UpdateStatusOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStatusOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatusOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
