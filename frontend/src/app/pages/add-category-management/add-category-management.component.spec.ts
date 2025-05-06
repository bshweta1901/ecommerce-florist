import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryManagementComponent } from './add-category-management.component';

describe('AddCategoryManagementComponent', () => {
  let component: AddCategoryManagementComponent;
  let fixture: ComponentFixture<AddCategoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCategoryManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
