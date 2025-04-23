import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestManagementComponent } from './service-request-management.component';

describe('ServiceRequestManagementComponent', () => {
  let component: ServiceRequestManagementComponent;
  let fixture: ComponentFixture<ServiceRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
