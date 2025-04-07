import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {DialogCloseShiftComponent} from '../dialog-close-shift/dialog-close-shift.component';
import {OperatorService} from '../../../../services/operator/operator.service';
// const SERVER_URL = 'ws://54.82.57.60:3001/';

interface ItemMenu {
  icon: string;
  name: string;
  routeRedirect: string;
}

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby-home.component.html',
  styleUrls: ['./lobby-home.component.scss']
})
export class LobbyHomeComponent implements OnInit {
  rowsMenu: ItemMenu[][] = [
    [
      {icon: './assets/menu/tankers.svg', name: 'Tanqueos', routeRedirect: '/operator/lobby/tankers'},
      {icon: './assets/menu/history.svg', name: 'Histórico de Tanqueos', routeRedirect: '/operator/lobby/history-sales'},
    ],
    [
      {icon: './assets/menu/pos.svg', name: 'Canastilla', routeRedirect: '/operator/lobby/pos'},
      {icon: './assets/menu/summary.svg', name: 'Resumen de Cantidades', routeRedirect: '/operator/summary-current/true'},
    ],
  ];

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private _operatorService : OperatorService
  ) {
  }

  ngOnInit(): void {
    this._operatorService.clearListToPrint();
  }

  async openModalCloseShift() {
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
}
