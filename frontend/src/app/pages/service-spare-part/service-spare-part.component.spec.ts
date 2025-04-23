import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSparePartComponent } from './service-spare-part.component';

describe('ServiceSparePartComponent', () => {
  let component: ServiceSparePartComponent;
  let fixture: ComponentFixture<ServiceSparePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSparePartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSparePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
