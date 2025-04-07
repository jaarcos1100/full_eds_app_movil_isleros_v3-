import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewRemainingSalesComponent } from './dialog-view-remaining-sales';

describe('DialogRegisterSaleComponent', () => {
  let component: DialogViewRemainingSalesComponent;
  let fixture: ComponentFixture<DialogViewRemainingSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewRemainingSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewRemainingSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
