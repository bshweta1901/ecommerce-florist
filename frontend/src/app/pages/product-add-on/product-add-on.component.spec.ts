import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddOnComponent } from './product-add-on.component';

describe('ProductAddOnComponent', () => {
  let component: ProductAddOnComponent;
  let fixture: ComponentFixture<ProductAddOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAddOnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
