import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInOperatorComponent } from './sign-in-operator.component';

describe('SignInOperatorComponent', () => {
  let component: SignInOperatorComponent;
  let fixture: ComponentFixture<SignInOperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInOperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
