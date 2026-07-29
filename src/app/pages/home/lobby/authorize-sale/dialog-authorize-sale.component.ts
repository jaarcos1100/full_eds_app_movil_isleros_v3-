import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {FormControl, FormControlName, Validators} from '@angular/forms';
import {Hose} from '../../../../models/hose/hose';
import {RegisterSale} from '../../../../models/register-sale/RegisterSale';
import {ToastService} from '../../../../services/toast/toast.service';
import {ModalController, NavParams, NavController} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {LocalStorageIpPortService} from '../../../../services/localStorageIpPort/local-storage-ip-port.service';


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

  formControlQuantityVolumenLite:FormControl = new FormControl('',[Validators.required, Validators.min(0), Validators.max(999)]);

  formControlQuantityMoneyLite:FormControl = new FormControl('',[Validators.required, Validators.min(0), Validators.max(100000000)]);

  public data: Hose = this.navParams.get('data');

  public value_product:number = this.data.product.value;

  public is_lite:boolean;


  constructor(private operatorService: OperatorService, private toastService: ToastService, public modalController: ModalController,
              private navParams: NavParams, private loadingService: LoadingService, public navCtrl: NavController) {
    this.is_lite = LocalStorageIpPortService.getIsFullEDSLite()==true ?  true : false;

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
    console.log(this.value_product);
    this.changeValueVolumenLite();
    this.changeValueMoneyLite();
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

  /**
   * Mensaje de error volumen
   */
   getErrorMessageQuantityVolumenLite() {
    return this.formControlQuantityVolumenLite.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlQuantityVolumenLite.hasError('min') || this.formControlQuantityVolumenLite.hasError('max')
        ? 'Debe ser superior a 0 e inferior a 1000 galones'
        : '';
  }

  /**
   * Mensaje de error dinero
   */
   getErrorMessageQuantityMoneyLite() {
    return this.formControlQuantityMoneyLite.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlQuantityMoneyLite.hasError('min') || this.formControlQuantityMoneyLite.hasError('max')
        ? 'Debe ser superior a $0 e inferior a $100.000.000 galones'
        : '';
  }

  auhtorize(){
    if(this.is_lite){
      this.nextLite();
    }else{
      this.next();
    }
  }

  nextLite() {
    // this.matDialogRef.close();

      if(this.formControlPlaque.valid && this.formControlQuantityVolumenLite.valid){

        const registerSale: any = {
          placa: this.formControlPlaque.value.toUpperCase(),
          manguera: this.data.id_hose,
          surtidor: this.getIdPump(),
          isla: this.operatorService.readLocalHostIsland().id_isle,
          volumen:this.formControlQuantityVolumenLite.value
        };
        this.operatorService.registerSaleLite(registerSale).subscribe(
          value => {
            this.showSuccessAlert();
            
            let body:any = value;
            console.log("****************");
            console.log(body.body.sale);
            console.log("****************");
            this.preload = false;
            this.operatorService.saveIdSaleOnInfoSaleOption(body?.body?.sale?._id);
            this.navCtrl.navigateRoot('operator/lobby/info-sale');
            this.modalController.dismiss();
          },
          error => {
            this.preload = false;
            this.toastService.presentToastError(error?.error?.body?.message || 'Error en la conexión, intente nuevamente');
          }
        );
      }

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
        if (indexOfFloat != -1) {
          quantity_text = String(quantity);
        } else {
          quantity_text = String(quantity) + ".0";
        }
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
      this.operatorService.registerSale(registerSale).subscribe(
        value => {
          this.showSuccessAlert();
          this.preload = false;
          this.modalController.dismiss();
        },
        error => {
          this.preload = false;
          this.toastService.presentToastError(error?.error?.body?.message || 'Error en la conexión, intente nuevamente');
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

  changeValueVolumenLite(){
    this.formControlQuantityVolumenLite.valueChanges.subscribe((volume) => {
      console.log('Usuario digitó:', volume);

      if (volume && volume.toString().length > 0) {
        // Ejecuta tu lógica aquí (redondeado para evitar errores de precisión de punto flotante)
        let total_money = Math.round(volume * this.value_product);
        this.formControlQuantityMoneyLite.setValue(total_money, { emitEvent: false });
      } else {
        // Si se borra el volumen, el dinero calculado tampoco tiene sentido: se limpia también
        this.formControlQuantityMoneyLite.setValue('', { emitEvent: false });
      }
    });

  }

  changeValueMoneyLite(){
    this.formControlQuantityMoneyLite.valueChanges.subscribe((money) => {
      console.log('Usuario digitó:', money);

      if (money && money.toString().length > 0) {
        // Ejecuta tu lógica aquí (redondeado a 3 decimales, precisión estándar de volumen en litros)
        let total_volume = Math.round((money / this.value_product) * 1000) / 1000;
        this.formControlQuantityVolumenLite.setValue(total_volume, { emitEvent: false });
      } else {
        // Si se borra el dinero, el volumen calculado tampoco tiene sentido: se limpia también
        this.formControlQuantityVolumenLite.setValue('', { emitEvent: false });
      }
    });

  }

  setMoneyOption(money:number){
    let total_volume = Math.round((money / this.value_product) * 1000) / 1000;
    this.formControlQuantityVolumenLite.setValue(total_volume, { emitEvent: false });
    this.formControlQuantityMoneyLite.setValue(money, { emitEvent: false });
  }
}
