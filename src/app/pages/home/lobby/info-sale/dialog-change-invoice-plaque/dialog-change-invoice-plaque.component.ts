import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormControl, FormControlName, Validators} from '@angular/forms';
import {LoadingService} from '../../../../../services/loading/loading.service';
import {OperatorService} from '../../../../../services/operator/operator.service';
import {ToastService} from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-dialog-change-invoice-plaque',
  templateUrl: './dialog-change-invoice-plaque.component.html',
  styleUrls: ['./dialog-change-invoice-plaque.component.scss'],
})
export class DialogChangeInvoicePlaqueComponent implements OnInit {

  formControlPlaque: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
  );

  preload = false;
  errorMessage: string;

  constructor(public modalController: ModalController, private loadingService: LoadingService, private operatorService: OperatorService, private toastService: ToastService) { }

  ngOnInit() {}

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

  changePlaque(){
      // this.matDialogRef.close();
    
      if(this.formControlPlaque.valid){
 
  
        this.preload = true;
        this.startLoading();
        this.errorMessage = undefined;

        let changePlaque = {
          plaque: this.formControlPlaque.value.toUpperCase()
        };

        let sale_id = this.operatorService.readSaleID();

        this.operatorService.changePlaque(changePlaque, sale_id).subscribe(
          value => {
            this.showSuccessAlert();
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

  showSuccessAlert() {
    this.toastService.presentToastOk('Venta autorizada.');
  }







}
