import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {FormControl, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../services/toast/toast.service';
import {AlertController, ModalController, NavController, NavParams} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import { Hose } from 'src/app/models/hose/hose';
import { Pump } from 'src/app/models/pump/pump';
import { Shift } from 'src/app/models/shift/Shift';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-view-remaining-sales',
  templateUrl: './dialog-view-remaining-sales.component.html',
  styleUrls: ['./dialog-view-remaining-sales.component.scss']
})
export class DialogViewRemainingSalesComponent implements OnInit {
  preload = false;
  public pumps: Pump[] = this.navParams.get('pumps');
  public shift: Shift = this.navParams.get('shift');
  public isShiftInvalid = false;
  public preloadForceClose = false;

  constructor(
    public navCtrl: NavController,
    private operatorService: OperatorService,
    private navParams: NavParams,
    public modalController: ModalController,
    private alertController: AlertController,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.checkShiftValidity();
  }

  /**
   * Si el turno ya fue cerrado desde administración o lleva abierto más del máximo
   * permitido, se considera inválido y se habilita la opción de forzar el cierre.
   */
  private checkShiftValidity() {
    if (!this.shift?._id) {
      return;
    }
    this.operatorService.isShiftClosedOrExpired().subscribe(invalid => {
      this.isShiftInvalid = invalid;
    });
  }

  /**
   * Muestra el aviso de que este paso lo debe autorizar administración, y pide el
   * código de confirmación (mismo esquema "app" + minuto de la hora usado en el
   * resto de la app) antes de forzar el cierre del turno.
   */
  async openForceCloseAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert-password-save',
      header: 'Autorización de administración',
      message: 'Este turno ya no es válido (fue cerrado por administración o expiró). ' +
        'Forzar el cierre desde aquí debe ser autorizado por administración.',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Código de autorización'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel-button',
        }, {
          text: 'Forzar cierre',
          cssClass: 'alert-continue-button',
          handler: (data) => {
            const date = new Date();
            const minutes = date.getMinutes();
            const minutesCompare = minutes.toString().length === 1 ? '0' + minutes : minutes;
            if (data.password === 'app' + minutesCompare) {
              this.forceCloseShift();
            } else {
              this.toastService.presentToastError('Código de autorización incorrecto');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private forceCloseShift() {
    this.preloadForceClose = true;
    this.operatorService.forceCloseShift(this.shift._id).subscribe(() => {
      this.preloadForceClose = false;
      this.operatorService.clearShift();
      this.modalController.dismiss();
      this.toastService.presentToastOk('Turno cerrado');
      this.navCtrl.navigateRoot('operator');
    }, (error: HttpErrorResponse) => {
      this.preloadForceClose = false;
      this.toastService.presentToastError('No fue posible forzar el cierre del turno');
    });
  }
}
