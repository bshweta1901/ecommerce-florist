import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryMangementComponent } from './sub-category-mangement.component';

describe('SubCategoryMangementComponent', () => {
  let component: SubCategoryMangementComponent;
  let fixture: ComponentFixture<SubCategoryMangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryMangementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
