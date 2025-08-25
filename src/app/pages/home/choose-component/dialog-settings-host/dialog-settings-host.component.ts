import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {FormControl, Validators} from '@angular/forms';
import {ToastService} from '../../../../services/toast/toast.service';
import {AlertController, ModalController} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {LocalStorageIpPortService} from '../../../../services/localStorageIpPort/local-storage-ip-port.service';
import {InfoProductsBasket} from '../../../../models/product/product';
import {DataphoneService} from '../../../../services/dataphone/dataphone.service';


import { Plugins } from '@capacitor/core';

const { dataphone } = Plugins;

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-settings-host.component.html',
  styleUrls: ['./dialog-settings-host.component.scss']
})
export class DialogSettingsHostComponent implements OnInit {
  formControlIP: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(7), Validators.maxLength(40)]
  );
  formControlPort: FormControl = new FormControl('',
    [Validators.required, Validators.maxLength(5), Validators.pattern('[0-9]+')]
  );

  public is_dataphone:boolean;
  public is_print:boolean;
  public is_full_eds_lite:boolean;

  constructor(private localStorageIpPortService: LocalStorageIpPortService,
              private operatorService: OperatorService,
              private toastService: ToastService,
              public modalController: ModalController,
              private loadingService: LoadingService,
              private alertController: AlertController,
              public dataphoneService:DataphoneService
  ) {
    debugger;
    this.formControlIP.setValue(LocalStorageIpPortService.readIp());
    this.formControlPort.setValue(LocalStorageIpPortService.readPort());
    this.is_dataphone = LocalStorageIpPortService.getIsDatafono()==true ?  true : false;
    this.is_print =LocalStorageIpPortService.getIsPrint()==true ?  true : false;
    this.is_full_eds_lite =LocalStorageIpPortService.getIsFullEDSLite()==true ?  true : false;


  }

  ngOnInit(): void {
  }

  // private startLoading() {
  //   this.loadingService.presentLoading().then(() => {
  //     this.stopLoading();
  //   });
  // }
  //
  // stopLoading() {
  //   const interval = setInterval(() => {
  //     if (this.preload === false) {
  //       clearInterval(interval);
  //       this.loadingService.dismissLoading();
  //     }
  //   }, 500);
  // }

  saveIpAndPort() {
    if (this.formControlIP.valid && this.formControlPort.valid) {
      this.localStorageIpPortService.saveIp(this.formControlIP.value);
      this.localStorageIpPortService.savePort(this.formControlPort.value);
      this.localStorageIpPortService.setIsDatafono(this.is_dataphone);
      this.localStorageIpPortService.setIsPrint(this.is_print);
      this.localStorageIpPortService.setIsFullEDSLite(this.is_full_eds_lite);
      this.toastService.presentToastOk('Datos Guardados');
      this.modalController.dismiss('created');
    } else {
      this.formControlIP.markAsTouched();
      this.formControlPort.markAsTouched();
    }
  }

  /**
   * Mensaje de error IP
   */
  getErrorMessageIP() {
    return this.formControlIP.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlIP.hasError('minlength')
        ? 'Longitud mínima de 7 caracteres'
        : this.formControlIP.hasError('maxlength')
          ? 'Longitud máxima de 40 caracteres'
          : '';
  }

  /**
   * Mensaje de error Puerto
   */
  getErrorMessagePort() {
    return this.formControlPort.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlPort.hasError('maxlength')
        ? 'Longitud máxima de 5 caracteres'
        : this.formControlPort.hasError('pattern')
          ? 'Solo se permiten caracteres numéricos'
          : '';
  }

  async openAlertPassword() {
    const alert = await this.alertController.create({
      cssClass: 'alert-password-save',
      header: 'Ingrese la Contraseña',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Guardar',
          cssClass: 'alert-continue-button',
          handler: async (data) => {
            const date = new Date();
            const minutes = date.getMinutes();
            const minutesCompare = minutes.toString().length === 1 ? '0' + minutes : minutes;
            if (data.password === 'app' + minutesCompare) {
              this.saveIpAndPort();
            } else {
              this.toastService.presentToastError('Contraseña Incorrecta');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async testQR(){

    try {
      //console.log(this.valorVenta.toString());
      //console.log(this.impuesto.toString());
      //console.log(this.propina.toString());
      //console.log(this.iac.toString());
      // Validar y preparar los datos ingresados por el usuario

      let dataTransfern = {
        order: "Order"
      };
      let response = await this.dataphoneService.startPrintQR(dataTransfern);
      alert(response);
      
    } catch (error) {
      console.log(`Error al procesar la transacción: ${error}`)
      console.error('Error en enviarDatos:', error);
    }

  }
  
}
