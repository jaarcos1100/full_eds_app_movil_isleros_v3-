import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {OperatorService} from '../../../../services/operator/operator.service';
import {Router} from '@angular/router';
import {ModalController, NavParams} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {ToastService} from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-put-volume',
  templateUrl: './dialog-put-volume.component.html',
  styleUrls: ['./dialog-put-volume.component.scss']
})
export class DialogPutVolumenComponent implements OnInit {


  formVolume: FormControl = new FormControl('',
    [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/), Validators.min(0)]
  );

  // formControlDigit: FormControl = new FormControl('',
  //   [Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]+')]
  // );
  public errorMessage: string;
  @Output() changeToInvoice: EventEmitter<any> = new EventEmitter();

  public data: any;


  constructor(private operatorService: OperatorService,
              private router: Router,
              public modalController: ModalController,
              private loadingService: LoadingService,
              private toastService: ToastService,
              private navParams: NavParams
  ) {
    
    // this.formControlTypeUser.setValue(this.typeCompany.valueBackground);
    // this.getInfoOrganization();
    this.data = this.navParams.get('volume');
    this.formVolume.setValue(this.data);
    this.sanitizeVolumeInput();
  }



  ngOnInit(): void {
  }

  /**
   * type="number" no bloquea de forma confiable letras en todos los navegadores/dispositivos
   * (ej. pegar texto o teclados de autocompletado), así que se limpia el valor en cada cambio.
   */
  private sanitizeVolumeInput() {
    this.formVolume.valueChanges.subscribe((value) => {
      if (value === null || value === undefined) {
        return;
      }
      const sanitized = String(value).replace(/[^0-9.]/g, '');
      if (sanitized !== value) {
        this.formVolume.setValue(sanitized, {emitEvent: false});
      }
    });
  }

  saveVolumen(){
    if (this.formVolume.valid) {
      this.modalController.dismiss(this.formVolume.value);
    } else {
      this.formVolume.markAsTouched();
    }
  }

  getErrorMessageNumber() {
    return this.formVolume.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formVolume.hasError('pattern') || this.formVolume.hasError('min')
        ? 'Ingresa un valor numérico válido'
        : '';
  }


}


