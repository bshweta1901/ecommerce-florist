import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerManagmentComponent } from './banner-managment.component';

describe('BannerManagmentComponent', () => {
  let component: BannerManagmentComponent;
  let fixture: ComponentFixture<BannerManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerManagmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
