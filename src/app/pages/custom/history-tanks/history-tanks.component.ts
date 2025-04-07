import {Component, OnInit} from '@angular/core';
import {Sale} from '../../../models/sale/sale';
import {OperatorService} from '../../../services/operator/operator.service';
import {ToastService} from '../../../services/toast/toast.service';
import {NavController} from '@ionic/angular';
import {LoadingService} from '../../../services/loading/loading.service';
import {InvoiceComponent} from '../../home/lobby/invoice/invoice.component';

@Component({
  selector: 'app-history-tanks',
  templateUrl: './history-tanks.component.html',
  styleUrls: ['./history-tanks.component.scss'],
})
export class HistoryTanksComponent implements OnInit {
  public historicalSales: Sale[] = [];
  public idHoses: string[];
  public preload: boolean;
  public nitDummie: string = InvoiceComponent.nitDummie;
  public errorMessage: string;
  public isFuelSelected = true;

  constructor(
    private operatorService: OperatorService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private navCtrl: NavController,
  ) {
    this.getListIdHosesOfIsle();
  }

  ngOnInit(): void {
    this.getHistoricalSalesFuel();
  }

  getListIdHosesOfIsle(): string[] {
    const isleSummary = this.operatorService.readLocalHostIsleSummary();
    const hoses = isleSummary.hoses;
    if (!hoses || hoses.length === 0) {
      return [];
    }
    this.idHoses = hoses.map(h => h._id);
  }

  getIdIsle(): string {
    const isleSummary = this.operatorService.readLocalHostIsleSummary();
    return isleSummary?.isle?._id;
  }

  getHistoricalSalesFuel() {
    this.startLoading();
    this.errorMessage = undefined;
    const body = {
      hoses: this.idHoses,
    };
    this.historicalSales?.splice(0, this.historicalSales.length);
    this.operatorService.getHistoricalSalesFuel(body).subscribe(value => {
      this.preload = false;
      this.loadingService.dismissLoading();
      this.historicalSales = value.body?.body?.sales;
    }, error => {
      this.preload = false;
      this.loadingService.dismissLoading();
      // this.modalController.dismiss();
      this.toastService.presentToastError('Fallo al consultar las ventas históricas, por favor intente nuevamente');
      this.errorMessage = 'Fallo al consultar las ventas históricas, por favor intente nuevamente';
    });
  }

  getHistoricalSalesBasket() {
    this.startLoading();
    this.errorMessage = undefined;
    const body = {
      isle: this.getIdIsle(),
    };
    this.historicalSales?.splice(0, this.historicalSales.length);
    this.operatorService.getHistoricalSalesBasket(body).subscribe(value => {
      this.preload = false;
      this.loadingService.dismissLoading();
      this.historicalSales = value.body?.body?.sales;
    }, error => {
      this.preload = false;
      this.loadingService.dismissLoading();
      // this.modalController.dismiss();
      this.toastService.presentToastError('Fallo al consultar las ventas históricas, por favor intente nuevamente');
      this.errorMessage = 'Fallo al consultar las ventas históricas, por favor intente nuevamente';
    });
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

  goToPrintSale(sale: Sale) {
    if (this.isFuelSelected) {
      this.operatorService.deleteUserRegister();
      this.operatorService.saveIdSaleOnInfoSaleOption(sale?._id);
      // this.modalController.dismiss();
      this.navCtrl.navigateRoot('operator/lobby/info-sale');
    } else {
      this.operatorService.saveIsBasketSale(true);
      this.operatorService.saveSaleID(sale?._id);
      this.navCtrl.navigateRoot('operator/lobby/invoice');
    }
  }

  convertToElectronicInvoice(sale: Sale) {
    this.startLoading();
    this.operatorService.convertToElectronicInvoice(sale._id).subscribe(value => {
      console.log(value);
      this.preload = false;
      this.loadingService.dismissLoading();
      if (this.isFuelSelected) {
        this.getHistoricalSalesFuel();
      } else {
        this.getHistoricalSalesBasket();
      }
      // this.modalController.dismiss();
      this.toastService.presentToastOk('Venta convertida a factura electrónica');
    }, error => {
      this.preload = false;
      this.loadingService.dismissLoading();
      this.toastService.presentToastError('Error convirtiendo venta a factura electrónica, por favor intente nuevamente');
    });
  }

  convertToFloatFixed3(value: number): number {
    try {
      return parseFloat(parseFloat('0' + value).toFixed(3));
    } catch (e) {
      return 0;
    }
  }

  selectFuel() {
    this.isFuelSelected = true;
    this.getHistoricalSalesFuel();
  }

  selectBasket() {
    this.isFuelSelected = false;
    this.getHistoricalSalesBasket();
  }
}
