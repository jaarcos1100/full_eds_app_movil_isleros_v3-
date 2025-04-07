import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogQuantityProductComponent } from './dialog-quantity-product.component';

describe('DialogRegisterSaleComponent', () => {
  let component: DialogQuantityProductComponent;
  let fixture: ComponentFixture<DialogQuantityProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogQuantityProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogQuantityProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
