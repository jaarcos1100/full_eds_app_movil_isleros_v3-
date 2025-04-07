import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSaleComponent } from './info-sale.component';

describe('DialogInfoSaleComponent', () => {
  let component: InfoSaleComponent;
  let fixture: ComponentFixture<InfoSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
