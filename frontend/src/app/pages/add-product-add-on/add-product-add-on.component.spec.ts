import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductAddOnComponent } from './add-product-add-on.component';

describe('AddProductAddOnComponent', () => {
  let component: AddProductAddOnComponent;
  let fixture: ComponentFixture<AddProductAddOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductAddOnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductAddOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
