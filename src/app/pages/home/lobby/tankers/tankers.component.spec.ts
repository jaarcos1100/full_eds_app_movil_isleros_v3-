import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TankersComponent } from './tankers.component';

describe('TankersComponent', () => {
  let component: TankersComponent;
  let fixture: ComponentFixture<TankersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TankersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
