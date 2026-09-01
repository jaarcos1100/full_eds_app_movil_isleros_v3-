import {Component, Input, OnInit} from '@angular/core';
import {DialogCloseShiftComponent} from '../../home/lobby/dialog-close-shift/dialog-close-shift.component';
import {ModalController, NavController} from '@ionic/angular';
import {ToastService} from '../../../services/toast/toast.service';
import { Router } from '@angular/router';
import {DialogHelpComponent} from '../../home/choose-component/dialog-help/dialog-help.component';
import { DialogViewRemainingSalesComponent } from '../../home/lobby/dialog-view-remaining-sales/dialog-view-remaining-sales';
import { Hose } from 'src/app/models/hose/hose';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { OperatorService } from 'src/app/services/operator/operator.service';
import { Isle } from 'src/app/models/isle/isle';
import { Pump } from 'src/app/models/pump/pump';

@Component({
  selector: 'app-toolbar-custom',
  templateUrl: './toolbar-custom.component.html',
  styleUrls: ['./toolbar-custom.component.scss'],
})
export class ToolbarCustomComponent implements OnInit {

  @Input() isHomePage: boolean;
  @Input() showOnlyHelp: boolean;
  private longPressActive: boolean;
  private preload: boolean;
  public visible:boolean;

  constructor(
    private modalController: ModalController,
    private toastService: ToastService,
    public navCtrl: NavController,
    public router: Router,
    private operatorService: OperatorService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.getCurrentRoute();
  }

  getCurrentRoute(){
    this.visible = true;
    if(this.router.url == "/operator/lobby/invoice"){
      this.visible = false;
    }
  }

  private startLoading() {
    this.preload = true;
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

  async openModalCloseShift() {
    this.startLoading();
    const isle: Isle = this.operatorService.readLocalHostIsland();
      const body = {
        isle: isle._id,
        shift: this.operatorService.readIsOpenShift()._id
      };
      this.operatorService.consultHoseSalesOfIsleInShift(body).subscribe(
        value => {
          this.preload = false;
          this.loadingService.dismissLoading();
          const pumps = value.body?.body?.result;
          if (pumps?.length > 0) {
            this.actionOpenModalViewRemainingSales(pumps);
          } else {
            this.actionOpenModalCloseShift();
          }
        }, error => {
          this.preload = false;
          this.loadingService.dismissLoading();
          this.toastService.presentToastError('No fue posible cerrar turno, por favor intente nuevamente');
        }
      );
    // this.openModalAuthorizeSale('asxasx');
  }

  async actionOpenModalViewRemainingSales(pumps: Pump[]): Promise<void> {
    const modal = await this.modalController.create({
      component: DialogViewRemainingSalesComponent,
      cssClass: 'fullscreen',
      componentProps: {
        pumps,
        shift: this.operatorService.readIsOpenShift()
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        // this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

  async actionOpenModalCloseShift(): Promise<void> {
    const modal = await this.modalController.create({
      component: DialogCloseShiftComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: 1
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        // this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

  goToHome() {
    if (!this.longPressActive) {
      this.navCtrl.navigateRoot('operator/lobby');
    }
  }

  goToTankers(event: any) {
    if (!this.longPressActive) {
      this.navCtrl.navigateRoot('operator/lobby/tankers');
    }
  }

  goToBasket(event: any) {
    if (!this.longPressActive) {
      this.navCtrl.navigateRoot('operator/lobby/pos');
    }
  }

  goToHistorySales(event: any) {
    if (!this.longPressActive) {
      this.navCtrl.navigateRoot('operator/lobby/history-sales');
    }
  }

  longPressHome(event: any) {
    this.timeOutLongPress();
    this.toastService.presentToastOk('Menú');
  }

  longPressTankers(event: any) {
    this.timeOutLongPress();
    this.toastService.presentToastOk('Tanqueos');
  }

  longPressHistory(event: any) {
    this.timeOutLongPress();
    this.toastService.presentToastOk('Historial de ventas');
  }

  longPressBasket(event: any) {
    this.timeOutLongPress();
    this.toastService.presentToastOk('Canastilla');
  }

  longPressLogout($event: any) {
    this.timeOutLongPress();
    this.toastService.presentToastOk('Cerrar Turno');
  }

  longPressHelp($event: any) {
    this.timeOutLongPress();
    this.toastService.presentToastOk('Ayuda');
  }

  timeOutLongPress() {
    this.longPressActive = true;
  }

  disableLongPressActive() {
    setTimeout(() => {
      this.longPressActive = false;
    }, 1000);
  }

  isTankers() {
    return this.router.url.endsWith('operator/lobby/tankers');
  }

  isBasket() {
    return this.router.url.endsWith('operator/lobby/pos');
  }

  isHistorySales() {
    return this.router.url.endsWith('operator/lobby/history-sales');
  }

  async openModalHelp() {
    const modal = await this.modalController.create({
      component: DialogHelpComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: 1
      }
    });
    return modal.present();
  }
}
