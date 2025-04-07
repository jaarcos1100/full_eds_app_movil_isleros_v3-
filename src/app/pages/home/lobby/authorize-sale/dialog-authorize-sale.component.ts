import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {FormControl, FormControlName, Validators} from '@angular/forms';
import {Hose} from '../../../../models/hose/hose';
import {RegisterSale} from '../../../../models/register-sale/RegisterSale';
import {ToastService} from '../../../../services/toast/toast.service';
import {ModalController, NavParams} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-authorize-sale.component.html',
  styleUrls: ['./dialog-authorize-sale.component.scss']
})
export class DialogAuthorizeSaleComponent implements OnInit {
  preload = false;
  errorMessage: string;
  formControlPlaque: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
  );

  formControlMode:FormControl = new FormControl('',[Validators.required]);

  formControlQuantityMoney:FormControl = new FormControl('',[Validators.required, Validators.min(1), Validators.max(9999999)]);

  formControlQuantityVolumen:FormControl = new FormControl('',[Validators.required, Validators.min(0), Validators.max(999)]);
  
  
  public data: Hose = this.navParams.get('data');

  constructor(private operatorService: OperatorService, private toastService: ToastService, public modalController: ModalController,
              private navParams: NavParams, private loadingService: LoadingService) {
    console.log(this.data);
  }

  private startLoading() {
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  stopLoading() {
    const interval = setInterval(() => {
      if (this.preload === false) {
        clearInterval(interval);
        this.loadingService.dismissLoading();
      }
    }, 500);
  }

  ngOnInit(): void {
  }

  /**
   * Mensaje de error placa
   */
  getErrorMessagePlate() {
    return this.formControlPlaque.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlPlaque.hasError('minlength') || this.formControlPlaque.hasError('maxlength')
        ? 'La placa debe tener 6 dígitos'
        : '';
  }

  /**
   * Mensaje de error placa
   */
   getErrorMessageMode() {
    return this.formControlMode.hasError('required')
      ? 'Debes seleccionar el modo'
      : '';
  }

  /**
   * Mensaje de error money
   */
   getErrorMessageQuantityMoney() {
    return this.formControlQuantityMoney.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlQuantityMoney.hasError('min') || this.formControlQuantityMoney.hasError('max')
        ? 'Debe ser superior a 0 e inferior a $10.000.000 pesos'
        : '';
  }

  /**
   * Mensaje de error volumen
   */
   getErrorMessageQuantityVolumen() {
    return this.formControlQuantityVolumen.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlQuantityVolumen.hasError('min') || this.formControlQuantityVolumen.hasError('max')
        ? 'Debe ser superior a 0 e inferior a 1000 galones'
        : '';
  }

  next() {
    // this.matDialogRef.close();
  
    let mode_valid = false;
    if(this.formControlMode.valid){
      if(this.formControlMode.value == "0") {
        mode_valid = this.formControlPlaque.valid
      }else if(this.formControlMode.value == "1") {
        mode_valid = this.formControlPlaque.valid && this.formControlQuantityMoney.valid
      }else if(this.formControlMode.value == "2") {
        mode_valid = this.formControlPlaque.valid && this.formControlQuantityVolumen.valid
      }else{
        mode_valid=false;
      }
    }else{
      mode_valid = false;
    }
   
    if (mode_valid) {

      this.preload = true;
      this.startLoading();
      this.errorMessage = undefined;
      let quantity = 0;
      let quantity_text = "";
      if(this.formControlMode.value != "0"){
        quantity = this.formControlMode.value == "1" ? this.formControlQuantityMoney.value: this.formControlQuantityVolumen.value;
        let indexOfFloat = String(quantity).indexOf(".");
        indexOfFloat != -1 ? quantity_text = String(quantity) : quantity_text = String(quantity) + ".0";
      }
      const registerSale: RegisterSale = {
        plaque: this.formControlPlaque.value.toUpperCase(),
        id_hose: this.data.id_hose,
        id_pump: this.getIdPump(),
        id_side: this.data.side.id_side,
        id_isle: this.operatorService.readLocalHostIsland().id_isle,
        mode:this.formControlMode.value,
        quantity:quantity_text
      };
      console.log(registerSale);
      this.operatorService.registerSale(registerSale).subscribe(
        value => {
          this.showSuccessAlert();
          console.log(value);
          this.preload = false;
          this.modalController.dismiss();
        },
        error => {
          this.preload = false;
          this.toastService.presentToastError('Error en la conexión, intente nuevamente');
        }
      );
    } else {
      this.formControlPlaque.markAsTouched();
    }
  }

  showSuccessAlert() {
    this.toastService.presentToastOk('Venta autorizada.');
  }

  private getIdPump(): number {
    const isleSummary = this.operatorService.readLocalHostIsleSummary();
    for (const pump of isleSummary.pumps) {
      if (pump._id === this.data.side.pump) {
        return pump.id_pump;
      }
    }
    return undefined;
  }
}
