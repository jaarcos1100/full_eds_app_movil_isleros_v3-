import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {IsleSummary} from '../../../../models/isle-summary/IsleSummary';
import {Sale} from '../../../../models/sale/sale';
import {MatDrawer} from '@angular/material/sidenav';
import {OperatorService} from '../../../../services/operator/operator.service';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {ToastService} from '../../../../services/toast/toast.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {Isle} from '../../../../models/isle/isle';
import {Pump} from '../../../../models/pump/pump';
import {Hose} from '../../../../models/hose/hose';
import {Side} from '../../../../models/side/Side';
import {DialogCloseShiftComponent} from '../dialog-close-shift/dialog-close-shift.component';
import {DialogAuthorizeSaleComponent} from '../authorize-sale/dialog-authorize-sale.component';
import {DialogHistoricalSalesComponent} from '../dialog-historical-sales/dialog-historical-sales.component';
import { DialogViewRemainingSalesComponent } from '../dialog-view-remaining-sales/dialog-view-remaining-sales';

@Component({
  selector: 'app-tankers',
  templateUrl: './tankers.component.html',
  styleUrls: ['./tankers.component.scss'],
})
export class TankersComponent implements OnInit {
  preload = false;
  errorMessage: string;
  errorMessageCloseShift: string;
  isleSummary: IsleSummary;
  opened = 'initial';
  // @ts-ignore
  listSales: Sale[] = [
    // // @ts-ignore
    // {vehicle: {plaque: 'KJXA89'}},
    // // @ts-ignore
    // {vehicle: {plaque: 'KJXA89'}},
    // // @ts-ignore
    // {vehicle: {plaque: 'KJXA89'}},
  ];
  modeDrawer: 'side' | 'push' | 'over';
  hasBackdropDrawer: boolean;
  @ViewChild('drawer') drawer: MatDrawer;
  private readonly maxSaleMinutes = 5;
  private lastSaleId: string;
  private intervalOpenSocket: any;
  private intervalHistoricalSales: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorService: OperatorService,
    public navCtrl: NavController,
    private modalController: ModalController,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private platform: Platform
  ) {


    this.isleSummary = this.operatorService.readLocalHostIsleSummary();
    console.log(this.isleSummary);
    if (!this.isleSummary) {
      const isle: Isle = operatorService.readLocalHostIsland();
      operatorService.getSummary(isle._id).subscribe(
        (value: any) => {
          this.isleSummary = value.body;
          this.preload = false;
        },
        error => {
          this.preload = false;
          this.errorMessage = 'Error obteniendo los surtidores, por favor intente nuevamente';
        }
      );
    }
    if (screen.width > 600) {
      this.hasBackdropDrawer = false;
      this.modeDrawer = 'side';
    } else {
      this.hasBackdropDrawer = true;
      this.modeDrawer = 'over';
    }

    let listSales = this.operatorService.readListSalesToPrint();
    if (!listSales) {
      listSales = [];
      this.operatorService.saveListSalesToPrint(listSales);
    }

    // operatorService.savePlaque('CVI101');
    // this.infoSale(null);
    // this.selectHose(null);
    // this.basketSale();

    // const side: Side[] = [
    //   {_id: 's1', id_side: 1, name: 'lado 1'},
    //   {_id: 's2', id_side: 2, name: 'lado 2'},
    //   {_id: 's3', id_side: 1, name: 'lado 1'},
    //   {_id: 's4', id_side: 2, name: 'lado 2'},
    //   {_id: 's5', id_side: 1, name: 'lado 3'},
    //   {_id: 's6', id_side: 2, name: 'lado 4'},
    // ];
    //
    // const hoses: Hose[] = [
    //   {_id: 'h3', side: side[0], name: 'hose 2', id_hose: 2},
    //   {_id: 'h2', side: side[1], name: 'hose 3', id_hose: 3},
    //   {_id: 'h1', side: side[0], name: 'hose 1', id_hose: 1},
    //   {_id: 'h4', side: side[1], name: 'hose 4', id_hose: 4},
    //   {_id: 'h5', side: side[2], name: 'hose 5', id_hose: 5},
    //   {_id: 'h6', side: side[2], name: 'hose 6', id_hose: 6},
    //   {_id: 'h7', side: side[3], name: 'hose 7', id_hose: 7},
    //   {_id: 'h8', side: side[3], name: 'hose 8', id_hose: 8},
    //   {_id: 'h9', side: side[3], name: 'hose 9', id_hose: 9},
    //   {_id: 'h10', side: side[3], name: 'hose 10', id_hose: 10},
    //   {_id: 'h11', side: side[4], name: 'hose 11', id_hose: 11},
    //   {_id: 'h11', side: side[4], name: 'hose 11', id_hose: 11},
    //   {_id: 'h12', side: side[5], name: 'hose 12', id_hose: 12},
    //   // {_id: 'h8', side: side[3], name: 'hose 8', id_hose: 8},
    // ];
    //
    // const pumps: Pump[] = [
    //   {name: 'pump 1', _id: 'p1', id_pump: 1},
    //   {name: 'pump 2', _id: 'p2', id_pump: 2},
    //   {name: 'pump 3', _id: 'p3', id_pump: 3},
    // ];
    //
    // side[0].pump = pumps[0]._id;
    // side[1].pump = pumps[0]._id;
    //
    // side[2].pump = pumps[1]._id;
    // side[3].pump = pumps[1]._id;
    //
    // side[4].pump = pumps[2]._id;
    // side[5].pump = pumps[2]._id;
    //
    // this.isleSummary = {
    //   sides: side,
    //   hoses: hoses,
    //   pumps: pumps
    // };
  }

  ngOnInit(): void {
    this.loadSales();
  }

  /**
   * Cargar Lista de Ventas sin imprimir, se usa cuando se oprime sobre una manguera y se encuentra una venta para imprimir, en ese momento esa venta
   * se guarda en esta lista para no volver a consultarla en el caso de que el Islero oprima botón regresar y luego oprima nuevamente sobre
   */
  private loadSales() {
    this.listSales = this.operatorService.readListSalesToPrint();
  }

  basketSale() {
    this.operatorService.deleteUserRegister();
    // this.listSales = this.operatorService.readListSalesToPrint();
  }

  /**
   * Consulta las mangueras de un lado especídico de un Surtidor
   */
  getHosesOfPumpAndSide(pump: Pump, indexSide: number): Hose[] {
    const hoses: Hose[] = [];
    let sidesOfThisPump: Side[] = this.isleSummary.sides?.filter(s => s.pump?._id === pump._id);
    if (sidesOfThisPump) {
      sidesOfThisPump.sort((s1, s2) => s1.id_side - s2.id_side);
    } else {
      sidesOfThisPump = [];
    }
    // console.log(this.isleSummary.hoses.sort((l1, l2) => l1.side.id_side - l2.side.id_side));
    for (const hose of this.isleSummary.hoses.sort((l1, l2) => l1.side.id_side - l2.side.id_side)) {
      // console.log(hose, hose.side.pump, pump._id, hose.side.id_side, indexSide, hose.side.pump === pump._id, hose.side.id_side === sidesOfThisPump[indexSide].id_side);
      if (hose.side.pump === pump._id && hose.side.id_side === sidesOfThisPump[indexSide].id_side) {
        hoses.push(hose);
      }
    }
    // console.log(hoses);
    return hoses.sort((h1, h2) => h1.id_hose - h2.id_hose);
  }

  /**
   * En Desuso
   */
  infoSale(sale: Sale) {
    console.log(sale);
    this.operatorService.deleteUserRegister();
    this.operatorService.saveIdSaleOnInfoSaleOption(sale._id);
    // this.listSales = this.operatorService.readListSalesToPrint();
  }

  /**
   * Si hay ventas sin imprimir entonces se abre un Modal que muestra las mangueras de esas ventas.
   * Si ya están impresas todas las ventas de este turno se muestra un Modal para ingresar la cédula de Islero y poder cerrar turno
   */
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
        this.toastService.presentToastError('No fue posible cerra turno, por favor intetne nuevamente');
      }
    );
  }

  /**
   * Diálogo de ventas sin imprimir
   */
  async actionOpenModalViewRemainingSales(pumps: Pump[]): Promise<void> {
    const modal = await this.modalController.create({
      component: DialogViewRemainingSalesComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: pumps
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

  async openModalAuthorizeSale(hose) {
    const modal = await this.modalController.create({
      component: DialogAuthorizeSaleComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: hose
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        // this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

  /**
   * En Desuso
   */
  async openModalHistoricalSales() {
    const modal = await this.modalController.create({
      component: DialogHistoricalSalesComponent,
      cssClass: 'fullscreen',
      componentProps: {
        idSale: this.getListIdHosesOfIsle()
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        // this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

  getListIdHosesOfIsle(): string[] {
    const hoses = this.isleSummary.hoses;
    if (!hoses || hoses.length === 0) {
      return [];
    }
    return hoses.map(h => h._id);
  }

  /**
   * En Desuso
   */
  openBasket() {
    this.navCtrl.navigateRoot('operator/lobby/basket-plaque');
  }

  /**
   * Busca si hay una venta en esta manguera, si la hay entonces redirige al componente que muestra información de la venta, si no hay venta
   * entonces abre el diálogo para ingresar la placa del vehículo y poder autorizar venta
   */
  openModalOnClickHose(hose: Hose) {
    debugger;
    const sales = this.operatorService.readListSalesToPrint();
    // TODO
    // sales = [{_id: 3, hose: hose}];
    let saleInThisHose;
    if (sales) {
      saleInThisHose = sales.find(s => s.hose?._id === hose._id);
    }
    if (saleInThisHose) {
      this.operatorService.deleteUserRegister();
      this.operatorService.saveIdSaleOnInfoSaleOption(saleInThisHose?._id);
      this.navCtrl.navigateRoot('operator/lobby/info-sale');
    } else {
      this.startLoading();
      const body = {
        hose: hose?._id,
        pump: hose?.side?.pump,
        shift: this.operatorService.readIsOpenShift()._id
      };
      this.operatorService.consultSalesOfThisHose(body).subscribe(
        value => {
          this.preload = false;
          this.loadingService.dismissLoading();
          const sale = value.body?.body?.sale;
          if (sale) {
            this.operatorService.deleteUserRegister();
            const listSales = this.operatorService.readListSalesToPrint();
            saleInThisHose = sale;
            listSales.push(saleInThisHose);
            this.operatorService.saveListSalesToPrint(listSales);
            this.operatorService.saveIdSaleOnInfoSaleOption(saleInThisHose?._id);
            this.navCtrl.navigateRoot('operator/lobby/info-sale');
          } else {
            this.openModalAuthorizeSale(hose);
          }
        }, error => {
          this.preload = false;
          this.loadingService.dismissLoading();
          this.toastService.presentToastError('Error consultando ventas en esta manguera');
          this.openModalAuthorizeSale(hose);
        }
      );
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
}
