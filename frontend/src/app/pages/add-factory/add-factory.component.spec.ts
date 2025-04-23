import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactoryComponent } from './add-factory.component';

describe('AddFactoryComponent', () => {
  let component: AddFactoryComponent;
  let fixture: ComponentFixture<AddFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFactoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
