import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSettingsHostComponent } from './dialog-settings-host.component';

describe('DialogRegisterSaleComponent', () => {
  let component: DialogSettingsHostComponent;
  let fixture: ComponentFixture<DialogSettingsHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSettingsHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSettingsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
