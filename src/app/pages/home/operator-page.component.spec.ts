import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MessageComponentModule } from '../message/message.module';

import { OperatorPage } from './operator-page.component';

describe('HomePage', () => {
  let component: OperatorPage;
  let fixture: ComponentFixture<OperatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorPage ],
      imports: [IonicModule.forRoot(), MessageComponentModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
