import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnDemandComponent } from './add-on-demand.component';

describe('AddOnDemandComponent', () => {
  let component: AddOnDemandComponent;
  let fixture: ComponentFixture<AddOnDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOnDemandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
