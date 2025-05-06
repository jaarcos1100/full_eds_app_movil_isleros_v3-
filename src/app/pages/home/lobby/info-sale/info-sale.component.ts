import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OperatorService} from '../../../../services/operator/operator.service';
import {Sale} from '../../../../models/sale/sale';
import {ToastService} from '../../../../services/toast/toast.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {Router} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {DialogChangeInvoicePlaqueComponent} from './dialog-change-invoice-plaque/dialog-change-invoice-plaque.component';
import {UserDataInvoice} from '../../../../models/user-data-invoice/UserDataInvoice';

@Component({
  selector: 'app-dialog-info-sale',
  templateUrl: './info-sale.component.html',
  styleUrls: ['./info-sale.component.scss']
})
export class InfoSaleComponent implements OnInit {
  public sale: Sale;
  //   = {
  //   hose: {
  //     product: {
  //       name: 'asdasd'
  //     }
  //   }
  // };
  public preload: boolean;
  public errorMessage: string;
  public userDataInvoice: UserDataInvoice;
  currentUser: number | undefined; 

  constructor(public navCtrl: NavController, private operatorService: OperatorService, private loadingService: LoadingService, private toastService: ToastService, private modalController: ModalController) {

    // this.showInvoice = true;a
    this.getInfoSale();
    this.currentUser = 1;
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

  public getInfoSale() {
    this.startLoading();
    this.preload = true;
    this.errorMessage = undefined;
    this.operatorService.getSaleDetailsSummary(this.operatorService.readIdSaleOnInfoSaleOption()).subscribe(
      (value: any) => {
        this.sale = value.body.sale;
        if (this.sale) {
          if (this.sale.volume) {
            this.sale.volume = this.convertToFloatFixed3(this.sale.volume);
          }
          this.operatorService.saveTotalPriceSale(this.sale?.total_value);
          this.operatorService.savePlaque(this.sale?.vehicle?.plaque?.toUpperCase());
          this.operatorService.saveSaleID(this.sale?._id);
          this.operatorService.saveIsBasketSale(false);
          this.getDetailsCar();
        } else {
          this.errorMessage = 'Error obteniendo información de la venta';
        }
        this.preload = false;
      },
      error => {
        this.preload = false;
        this.errorMessage = 'Error obteniendo información de la venta';
        this.toastService.presentToastError('Error obteniendo información de la venta, por favor intente nuevamente');
      }
    );
  }

  ngOnInit(): void {
    // body: {
    //   status: ,
    //   entity: ,
    //   data: ,
    //   isle: ,
    // }
  }

  next() {
    // this.router.navigate(['operator/lobby/invoice']);
    this.navCtrl.navigateRoot('operator/lobby/invoice');
  }

  backToSales() {
    this.navCtrl.navigateRoot('operator/lobby/tankers');
  }

  convertToFloatFixed3(value: number): number {
    try {
      return parseFloat(parseFloat('0' + value).toFixed(3));
    } catch (e) {
      return 0;
    }
  }

  changePlaque() {
    this.openModalChangePlaque();
  }

  async openModalChangePlaque() {
    const modal = await this.modalController.create({
      component: DialogChangeInvoicePlaqueComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: 1
      }
    });
    modal.onDidDismiss().then(res => {
      //if (res.data) {
        this.getInfoSale();
      //}
    }).catch();
    return await modal.present();
  }

     /**
   * Consulta Información del vehículo dueño de la venta, para verificar las empresas asociadas a este
   */
    public getDetailsCar() {
        const plaque = {
          plaque: this.operatorService.readLocalHostPlaque()
          // plaque: 'MQX18C'
        };
        this.operatorService.getVehicleDetails(plaque).subscribe(
          (value: any) => {
            this.userDataInvoice = value.body;
            const companies = this.userDataInvoice.companies;
            if (companies) {
              // @ts-ignore
            }        },
          (error) => {
            if (error.status === 400) {
              this.toastService.presentToastError('La placa no se encuentra registrada');
              this.errorMessage = 'La placa no se encuentra registrada';
            } else {
              this.toastService.presentToastError('Error obteniendo los datos de la factura, intente nuevamente');
              this.errorMessage = 'Error obteniendo los datos de la factura, intente nuevamente';
            }
          }
        );
      }
}
