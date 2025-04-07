import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHistoricalSalesComponent } from './dialog-historical-sales.component';

describe('DialogRegisterSaleComponent', () => {
  let component: DialogHistoricalSalesComponent;
  let fixture: ComponentFixture<DialogHistoricalSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHistoricalSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHistoricalSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
