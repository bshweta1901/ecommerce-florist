import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSparePartRequestComponent } from './add-spare-part-request.component';

describe('AddSparePartRequestComponent', () => {
  let component: AddSparePartRequestComponent;
  let fixture: ComponentFixture<AddSparePartRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSparePartRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSparePartRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
