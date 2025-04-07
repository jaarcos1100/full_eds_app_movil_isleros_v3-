import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketSaleComponent } from './basket-sale.component';

describe('DialogBasketSaleComponent', () => {
  let component: BasketSaleComponent;
  let fixture: ComponentFixture<BasketSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasketSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
