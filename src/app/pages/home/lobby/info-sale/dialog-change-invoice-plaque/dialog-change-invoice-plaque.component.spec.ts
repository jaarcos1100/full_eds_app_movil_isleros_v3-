import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogChangeInvoicePlaqueComponent } from './dialog-change-invoice-plaque.component';

describe('DialogChangeInvoicePlaqueComponent', () => {
  let component: DialogChangeInvoicePlaqueComponent;
  let fixture: ComponentFixture<DialogChangeInvoicePlaqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogChangeInvoicePlaqueComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogChangeInvoicePlaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
