import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverAboutOfComponent } from './popover-about-of.component';

describe('DialogRegisterSaleComponent', () => {
  let component: PopoverAboutOfComponent;
  let fixture: ComponentFixture<PopoverAboutOfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAboutOfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverAboutOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
