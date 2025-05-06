import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPutVolumenComponent } from './dialog-put-volume.component';

describe('RegisterUserComponent', () => {
  let component: DialogPutVolumenComponent;
  let fixture: ComponentFixture<DialogPutVolumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPutVolumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPutVolumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
