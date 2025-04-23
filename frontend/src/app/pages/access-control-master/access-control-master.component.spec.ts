import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlMasterComponent } from './access-control-master.component';

describe('AccessControlMasterComponent', () => {
  let component: AccessControlMasterComponent;
  let fixture: ComponentFixture<AccessControlMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessControlMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
