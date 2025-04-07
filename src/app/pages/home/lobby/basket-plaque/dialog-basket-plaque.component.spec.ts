import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBasketPlaqueComponent } from './dialog-basket-plaque.component';

describe('DialogRegisterSaleComponent', () => {
  let component: DialogBasketPlaqueComponent;
  let fixture: ComponentFixture<DialogBasketPlaqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBasketPlaqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBasketPlaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
