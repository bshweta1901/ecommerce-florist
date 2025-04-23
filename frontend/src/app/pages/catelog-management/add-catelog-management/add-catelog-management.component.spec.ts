import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCatelogManagementComponent } from './add-catelog-management.component';

describe('AddCatelogManagementComponent', () => {
  let component: AddCatelogManagementComponent;
  let fixture: ComponentFixture<AddCatelogManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCatelogManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCatelogManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
