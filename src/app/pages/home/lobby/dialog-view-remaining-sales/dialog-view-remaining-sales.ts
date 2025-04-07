import {Component} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {FormControl, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../services/toast/toast.service';
import {ModalController, NavController, NavParams} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import { Hose } from 'src/app/models/hose/hose';
import { Pump } from 'src/app/models/pump/pump';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-view-remaining-sales',
  templateUrl: './dialog-view-remaining-sales.component.html',
  styleUrls: ['./dialog-view-remaining-sales.component.scss']
})
export class DialogViewRemainingSalesComponent {
  preload = false;
  public pumps: Pump[] = this.navParams.get('pumps');

  constructor(
    public navCtrl: NavController,
    private operatorService: OperatorService,
    private navParams: NavParams,
    public modalController: ModalController,
  ) {
  }
}
