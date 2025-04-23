import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePersonManagementComponent } from './service-person-management.component';

describe('ServicePersonManagementComponent', () => {
  let component: ServicePersonManagementComponent;
  let fixture: ComponentFixture<ServicePersonManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePersonManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePersonManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
