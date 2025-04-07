import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {ToastService} from '../../../../services/toast/toast.service';
import {ModalController, NavController, NavParams} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {Sale} from '../../../../models/sale/sale';
import {InvoiceComponent} from '../invoice/invoice.component';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-historical-sales.component.html',
  styleUrls: ['./dialog-historical-sales.component.scss']
})
export class DialogHistoricalSalesComponent implements OnInit {
  public historicalSales: Sale[];
  public isIsles: string[] = this.navParams.get('idSale');
  public preload: boolean;
  public nitDummie: string = InvoiceComponent.nitDummie;

  constructor(private operatorService: OperatorService,
              private toastService: ToastService,
              public modalController: ModalController,
              private loadingService: LoadingService,
              private navParams: NavParams,
              private navCtrl: NavController
  ) {
  }

  ngOnInit(): void {
  }
  //
  // getHistoricalSales() {
  //   this.startLoading();
  //   const body = {
  //     hoses: this.isIsles,
  //   };
  //   this.operatorService.getHistoricalSales(body).subscribe(value => {
  //     this.preload = false;
  //     this.loadingService.dismissLoading();
  //     this.historicalSales = value.body?.body?.sales;
  //     console.log(this.historicalSales);
  //   }, error => {
  //     this.preload = false;
  //     this.loadingService.dismissLoading();
  //     this.modalController.dismiss();
  //     this.toastService.presentToastError('Error consultando las ventas históricas, por favor intente nuevamente');
  //   });
  // }
  //
  // private startLoading() {
  //   this.preload = true;
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
  //
  // goToPrintSale(sale: Sale) {
  //   this.operatorService.deleteUserRegister();
  //   this.operatorService.saveIdSaleOnInfoSaleOption(sale?._id);
  //   this.modalController.dismiss();
  //   this.navCtrl.navigateRoot('operator/lobby/info-sale');
  // }

  // convertToElectronicInvoice(sale: Sale) {
  //   this.startLoading();
  //   this.operatorService.convertToElectronicInvoice(sale._id).subscribe(value => {
  //     console.log(value);
  //     this.preload = false;
  //     this.loadingService.dismissLoading();
  //     this.modalController.dismiss();
  //     this.toastService.presentToastOk('Venta convertida a factura electrónica');
  //   }, error => {
  //     this.preload = false;
  //     this.loadingService.dismissLoading();
  //     this.toastService.presentToastError('Error convirtiendo venta a factura electrónica, por favor intente nuevamente');
  //   });
  // }
  //
  // convertToFloatFixed3(value: number): number {
  //   try {
  //     return parseFloat(parseFloat('0' + value).toFixed(3));
  //   } catch (e) {
  //     return 0;
  //   }
  // }
}
