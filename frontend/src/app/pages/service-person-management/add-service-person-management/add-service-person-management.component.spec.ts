import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicePersonManagementComponent } from './add-service-person-management.component';

describe('AddServicePersonManagementComponent', () => {
  let component: AddServicePersonManagementComponent;
  let fixture: ComponentFixture<AddServicePersonManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServicePersonManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServicePersonManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
