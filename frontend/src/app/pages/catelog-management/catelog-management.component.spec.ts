import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatelogManagementComponent } from './catelog-management.component';

describe('CatelogManagementComponent', () => {
  let component: CatelogManagementComponent;
  let fixture: ComponentFixture<CatelogManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatelogManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatelogManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
