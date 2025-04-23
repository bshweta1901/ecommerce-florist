import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusServiceRequestManagementComponent } from './status-service-request-management.component';

describe('StatusServiceRequestManagementComponent', () => {
  let component: StatusServiceRequestManagementComponent;
  let fixture: ComponentFixture<StatusServiceRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusServiceRequestManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusServiceRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
