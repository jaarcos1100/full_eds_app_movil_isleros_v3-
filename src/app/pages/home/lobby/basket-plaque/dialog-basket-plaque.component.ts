import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {FormControl, Validators} from '@angular/forms';
import {ToastService} from '../../../../services/toast/toast.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {ModalController, NavController} from '@ionic/angular';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-basket-plaque.component.html',
  styleUrls: ['./dialog-basket-plaque.component.scss']
})
export class DialogBasketPlaqueComponent implements OnInit {
  preload = false;
  errorMessage: string;
  formControlPlaque: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
  );
  public showPlaque: boolean;

  constructor(public navCtrl: NavController,
              private operatorService: OperatorService,
              private loadingService: LoadingService,
              public modalController: ModalController,
              private toastService: ToastService) {
    // this.showPlaque = true;
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

    // TODO
    // this.showPlaque = true;
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

  next() {
    if (this.formControlPlaque.valid) {
      this.operatorService.savePlaque(this.formControlPlaque.value.toUpperCase());
      this.modalController.dismiss('saved');
    } else {
      this.formControlPlaque.markAsTouched();
    }
  }
}
