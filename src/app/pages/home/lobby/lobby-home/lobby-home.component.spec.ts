import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyHomeComponent } from './lobby-home.component';

describe('LobbyComponent', () => {
  let component: LobbyHomeComponent;
  let fixture: ComponentFixture<LobbyHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
