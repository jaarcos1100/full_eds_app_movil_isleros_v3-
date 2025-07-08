import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPutVolumenCloseComponent } from './dialog-put-volumen-close.component';

describe('DialogPutVolumenCloseComponent', () => {
  let component: DialogPutVolumenCloseComponent;
  let fixture: ComponentFixture<DialogPutVolumenCloseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPutVolumenCloseComponent]
    });
    fixture = TestBed.createComponent(DialogPutVolumenCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
