import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSparePartManagementComponent } from './add-spare-part-management.component';

describe('AddSparePartManagementComponent', () => {
  let component: AddSparePartManagementComponent;
  let fixture: ComponentFixture<AddSparePartManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSparePartManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSparePartManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
