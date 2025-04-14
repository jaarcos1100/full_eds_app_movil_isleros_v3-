import {AfterViewInit, Component} from '@angular/core';
import {Island} from '../../../models/island/Island';
import {OperatorService} from '../../../services/operator/operator.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalController, NavController, PopoverController} from '@ionic/angular';
import {ToastService} from '../../../services/toast/toast.service';
import {LoadingService} from '../../../services/loading/loading.service';
import {DialogSettingsHostComponent} from './dialog-settings-host/dialog-settings-host.component';
import {LocalStorageIpPortService} from '../../../services/localStorageIpPort/local-storage-ip-port.service';
import {FormControl, Validators} from '@angular/forms';
import {DialogHelpComponent} from './dialog-help/dialog-help.component';
import {PopoverAboutOfComponent} from './popover-about-of/popover-about-of.component';

@Component({
  selector: 'app-choose-component',
  templateUrl: './choose-island.component.html',
  styleUrls: ['./choose-island.component.scss'],
})
export class ChooseIslandComponent implements AfterViewInit {
  public listIslands: Island[] = [];
  public preload = true;
  public errorMessage: string;
  public formControlIsland: FormControl = new FormControl('', [Validators.required]);

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private operatorService: OperatorService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private localStorageIpPortService: LocalStorageIpPortService,
    public popoverController: PopoverController
  ) {}

  ngAfterViewInit(): void {
    this.loadIsles();
  
    const savedIp = LocalStorageIpPortService.readAddress();
  
    if (!savedIp) {
      const encodedIp = 'aHR0cDovLzE5Mi4xNjguMC4=';
  
      // Decodificar Base64 a string
      const decodedIp = atob(encodedIp);
  
      // Guardar IP y puerto en LocalStorage
      this.localStorageIpPortService.saveIp(decodedIp);
      this.localStorageIpPortService.savePort(3001);
    }
  }

  /**
   * Verificar si hay turno en LocalStorage para llevarlo al Lobby, sino se consultan las Islas de la EDS
   */
  loadIsles() {
    if (this.operatorService.readIsOpenShift()) {
      this.navCtrl.navigateRoot('operator/lobby');
    } else {
      this.getIsles();
    }
  }

  /**
   * Consultan las Islas de la EDS
   */
  public getIsles() {
    this.startLoading();
    this.preload = true;
    this.errorMessage = undefined;
    this.operatorService.getIslands().subscribe(
      (value: any) => {
        console.log(value);
        // this.toastService.presentToastOk(JSON.stringify(value));
        this.listIslands = value.body.isles;
        this.preload = false;
      },
      (error: HttpErrorResponse) => {
        // this.toastService.presentToastError(JSON.stringify(error?.error));
        this.preload = false;
        this.errorMessage = 'Fallo al cargar las islas, por favor intente nuevamente';
      }
    );
  }

  /**
   * Ventana de Carga mientras se consulta la Info de la Base de Datos
   * @private
   */
  private startLoading() {
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  /**
   * Retirar ventana de Carga si ya consultó la info de la Base de Datos
   */
  stopLoading() {
    const interval = setInterval(() => {
      if (this.preload === false) {
        clearInterval(interval);
        this.loadingService.dismissLoading();
      }
    }, 500);
  }

  /**
   * Acción cuando oprime continuar luego de seleccionar una isla
   *
   * Si elige una isla el servicio verifica si hay turno abierto (usando el servicio verifyTurn, si lo hay se muestra error),
   * si no hay turno abierto se verifica que las mangueras estén colgadas (usando el servicio statusHose), si están colgadas se redirige
   * a la siguiente ventana para inciar sesión
   */
  next() {
    if (this.formControlIsland.valid) {
      this.startLoading();
      this.preload = true;
      this.errorMessage = undefined;
      const island: Island = this.formControlIsland.value;
      console.log(island);
      this.operatorService.verifyTurn(island._id).subscribe(
        (value: any) => {
          if (value.body.avalaible) {
            // TODO
            // this.router.navigate(['operator/sign-in']);
            // this.operatorService.saveIsland(island);
            //
            console.log(island);
            this.operatorService.statusHose(island.id_isle).subscribe(
              (value1: any) => {
                console.log(value1);
                if (value1.body.estado === 1) {
                  this.operatorService.saveIsland(island);
                  // this.router.navigate(['operator/sign-in']);
                  this.navCtrl.navigateRoot('operator/sign-in');
                } else {
                  this.toastService.presentToastError('Las mangueras no están colgadas');
                }
                this.preload = false;
              },
              (error: HttpErrorResponse) => {
                this.preload = false;
                this.errorMessage = 'Error de conexión';
              }
            );
          } else {
            this.preload = false;
            this.toastService.presentToastError('La isla ya tiene un turno abierto');
          }
        },
        (error: HttpErrorResponse) => {
          this.preload = false;
          if (error.status === 400) {
            this.toastService.presentToastError('La isla ya tiene un turno abierto');
          } else {
            this.toastService.presentToastError('Error de conexión');
          }
        }
      );
    } else {
      this.toastService.presentToastError('Debes seleccionar una isla antes de continuar');
    }
  }

  async openModalConfigHost() {
    const modal = await this.modalController.create({
      component: DialogSettingsHostComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: 1
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        this.getIsles();
        // this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();

    // this.openModalAuthorizeSale('asxasx');
  }

  async openModalAboutOf(ev: Event) {
    const popover = await this.popoverController.create({
      component: PopoverAboutOfComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return popover.present();
  }

  getErrorMessageIsland(): string {
    return this.formControlIsland.hasError('required') ? 'Seleccione una isla' : '';
  }
}
