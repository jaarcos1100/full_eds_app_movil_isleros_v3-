import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCloseShiftComponent } from './dialog-close-shift.component';

describe('DialogRegisterSaleComponent', () => {
  let component: DialogCloseShiftComponent;
  let fixture: ComponentFixture<DialogCloseShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCloseShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCloseShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
