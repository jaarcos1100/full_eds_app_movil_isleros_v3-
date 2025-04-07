import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuthorizeSaleComponent } from './dialog-authorize-sale.component';

describe('DialogRegisterSaleComponent', () => {
  let component: DialogAuthorizeSaleComponent;
  let fixture: ComponentFixture<DialogAuthorizeSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAuthorizeSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuthorizeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
