import { Component, ElementRef, ViewChild } from '@angular/core';
import { OperatorService } from '../../../../services/operator/operator.service';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../services/toast/toast.service';
import { AlertController, IonContent, ModalController, NavController } from '@ionic/angular';
import { LoadingService } from '../../../../services/loading/loading.service';
import { IsleSummary } from '../../../../models/isle-summary/IsleSummary';
import { LocalStorageIpPortService } from '../../../../services/localStorageIpPort/local-storage-ip-port.service';
import { VolumeHose } from '../../../../models/volume-hose/VolumeHose';
import { Isle } from '../../../../models/isle/isle';
import { Pump } from '../../../../models/pump/pump';
import { Hose, ShiftHose } from '../../../../models/hose/hose';
import { Side } from '../../../../models/side/Side';
import { DialogPutVolumenCloseComponent } from './dialog-put-volumen-close/dialog-put-volumen-close.component';
import {DataphoneService} from '../../../../services/dataphone/dataphone.service';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-close-shift.component.html',
  styleUrls: ['./dialog-close-shift.component.scss']
})
export class DialogCloseShiftComponent {
  @ViewChild('content') content: IonContent;
  @ViewChild('dniSection') dniSection: ElementRef;
  preload = false;
  errorMessageCloseShift: string;
  formControlDNI: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[0-9]+')]
  );
  isleSummary: IsleSummary;
  public is_lite: boolean;
  public volumes: VolumeHose[];
  public isAccessAfterLogin: boolean;
  public side: number;
  public hose_id_to_put_volumen: number;
  errorMessage: string;
  public is_integrate_print:boolean;


  constructor(public navCtrl: NavController, private operatorService: OperatorService, private toastService: ToastService, public modalController: ModalController, private loadingService: LoadingService, public dataphoneService:DataphoneService, private alertController: AlertController) {
    this.is_lite = LocalStorageIpPortService.getIsFullEDSLite() == true ? true : false;
    this.is_integrate_print =LocalStorageIpPortService.getIsPrint()==true ?  true : false;

    if (this.is_lite) {

      this.getSummaryLite();
    }
  }

  public getSummaryLite() {
    console.log("ejecuta carga de lite");
    this.startLoading();
    this.preload = true;
    this.errorMessage = undefined;
    const isle: Isle = this.operatorService.readLocalHostIsland();
    this.operatorService.getSummary(isle._id).subscribe(
      (value: any) => {
        this.isleSummary = value.body;
        if (!this.isAccessAfterLogin) {
          this.operatorService.saveIsleSummary(this.isleSummary);
        }
        this.operatorService.getVolumesLite(isle.id_isle).subscribe(
          (value1: any) => {
            this.preload = false;
            this.loadingService.dismissLoading();
            this.volumes = value1.body;
            if (this.volumes) {
              for (const hose of this.isleSummary.hoses) {
                for (const volume of this.volumes) {
                  if (volume.hose?.id_hose === hose.id_hose) {
                    // @ts-ignore
                    hose.volume = volume.hose.volume;
                    break;
                  }
                }
              }
            }
          },
          error => {
            this.preload = false;
            this.toastService.presentToastError('Error obteniendo el resumen, por favor intente nuevamente');
          }
        );
      },
      error => {
        this.preload = false;
        this.toastService.presentToastError('Error obteniendo el resumen, por favor intente nuevamente');
      }
    );
  }

  putVolumenInHose(side, hose_id) {
    this.side = side;
    this.hose_id_to_put_volumen = hose_id;
    let index_hose = this.findHosePosition();
    this.openModalPutVolume(index_hose);
  }

  findHosePosition() {
    return this.isleSummary.hoses.findIndex(h => h.id_hose === this.hose_id_to_put_volumen);
  }

  async openModalPutVolume(index_hose) {
    if (this.is_lite) {
      const modal = await this.modalController.create({
        component: DialogPutVolumenCloseComponent,
        cssClass: 'fullscreen',
        componentProps: {
          side: this.side,
          volume: this.isleSummary.hoses[index_hose].volume
        }
      });
      modal.onDidDismiss().then(res => {
        if (res.data) {
          let volumeResponse = res.data;
          this.isleSummary.hoses[index_hose].volume = volumeResponse;
        }
      }).catch();
      return await modal.present();
    }
  }


  private buildBodyVolumesHoses(hoses: any[]): any[] {
    const hoseVolumes = [];
    for (const volumeHose of hoses) {
      hoseVolumes.push({
        hose: volumeHose.hose._id,
        volume: this.is_lite ? volumeHose.hose.volume / 100 : volumeHose.hose.volume
      });
    }
    return hoseVolumes;
  }

  buildBodyCloseShift(bodyVolumesHoses: any[]) {
    return {
      id_shift: this.operatorService.readIsOpenShift()._id,
      user: this.formControlDNI.value,
      isle: this.operatorService.readLocalHostIsland()._id,
      hoses: bodyVolumesHoses,
      is_lite:this.is_lite,
      is_integrate_print:this.is_integrate_print
    };
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

  callServicesCloseTurn() {
    if (this.is_lite) {
      this.validateVolumesLite();
    } else {
      this.closeTurn();
    }
  }

  validateVolumesLite(){
    if (!(this.isleSummary?.hoses?.length > 0)) {
      this.errorMessage = 'La isla no tinen mangueras registradas';
      return;
    }
    let can_open_shift = true;
    this.isleSummary.hoses.forEach(element => {
      if(element.volume == 0){
        this.toastService.presentToastWarning("Debes diligenciar el volumen de todas las mangueras");
        can_open_shift = false;
        return;
      }
    });
    if(can_open_shift){
      this.closeTurnLite();
    }
  }

  public closeTurnLite() {
    if (this.formControlDNI.valid) {
      const userOperator = this.operatorService.readLocalHostOperator();
      if (this.formControlDNI.value?.toString().trim() !== userOperator.document) {
        this.toastService.presentToastError('Está cédula no corresponde con el usuario actual');
        return;
      }

      this.preload = true;
      this.startLoading();
      this.errorMessageCloseShift = undefined;
      this.operatorService.findShift(this.operatorService.readIsOpenShift()._id).subscribe((res: any) => {
        console.log(res);
        const shift = res.body?.shift;
        if (shift?.final_date) {
          this.preload = false;
          this.loadingService.dismissLoading();
          this.modalController.dismiss();
          this.toastService.presentToastError('El turno ya está cerrado');
          this.operatorService.clearShift();
          this.navCtrl.navigateRoot('operator');
          return;
        }

        let bodyVolumes = this.transformData(this.isleSummary);
        const bodyVolumesHoses = this.buildBodyVolumesHoses(bodyVolumes.body);
        const bodyCloseShift = this.buildBodyCloseShift(bodyVolumesHoses);
        this.operatorService.closeShift(bodyCloseShift).subscribe(
          value2 => {
            this.preload = false;
            this.loadingService.dismissLoading();
            this.modalController.dismiss();
            this.toastService.presentToastOk('Turno finalizado');
            this.operatorService.resumeShift(bodyCloseShift).subscribe(
              value3 => {
                console.log(JSON.stringify(value3));
                this.print(value3);
                this.openReprintClosingAlert(value3);
              }
            );
            this.operatorService.clearShift();
            //this.router.navigate(['operator']);
            this.navCtrl.navigateRoot('operator');
          },
          (error: HttpErrorResponse) => {
            this.preload = false;
            if (error.status === 400 && error.error?.body?.message) {
              this.errorMessageCloseShift = error.error?.body?.message;
            } else {
              this.toastService.presentToastError('No se logró finalizar el turno, por favor intente nuevamente');
            }
          }
        );

      }, error => {
        this.preload = false;
        this.toastService.presentToastError('Error de conexión');
      });
    } else {
      this.formControlDNI.markAsTouched();
      this.scrollToDNIField();
    }
  }

  transformData(input) {
    if (!input || !input.hoses || !input.pumps) {
      return { success: false, body: [] };
    }
  
    // Crear un mapa de pumps por su _id para acceso rápido
    const pumpMap = {};
    input.pumps.forEach(pump => {
      pumpMap[pump._id] = {
        id_pump: pump.id_pump,
        name: pump.name
      };
    });
  
    // Procesar las hoses
    const body = input.hoses.map(hose => {
      // Obtener el pump relacionado
      const pumpId = hose.side.pump;
      const pumpData = pumpMap[pumpId];
  
      return {
        pump: pumpData,
        hose: {
          _id: hose._id,
          id_hose: hose.id_hose,
          product: hose.product.name,
          volume: hose.volume
        }
      };
    });
  
    return { success: true, body };
  }

  public closeTurn() {
    if (this.formControlDNI.valid) {
      const userOperator = this.operatorService.readLocalHostOperator();
      if (this.formControlDNI.value?.toString().trim() !== userOperator.document) {
        this.toastService.presentToastError('Está cédula no corresponde con el usuario actual');
        return;
      }
      this.preload = true;
      this.startLoading();
      this.errorMessageCloseShift = undefined;
      const isle = this.operatorService.readLocalHostIsland();
      this.operatorService.findShift(this.operatorService.readIsOpenShift()._id).subscribe((res: any) => {
        console.log(res);
        const shift = res.body?.shift;
        if (shift?.final_date) {
          this.preload = false;
          this.loadingService.dismissLoading();
          this.modalController.dismiss();
          this.toastService.presentToastError('El turno ya está cerrado');
          this.operatorService.clearShift();
          this.navCtrl.navigateRoot('operator');
          return;
        }
        this.operatorService.statusHose(isle.id_isle).subscribe(
          (value: any) => {

            if (value.body.estado === 1) {
              this.operatorService.getVolumes(isle.id_isle).subscribe(
                (value1: any) => {
                  const bodyVolumesHoses = this.buildBodyVolumesHoses(value1.body);
                  const bodyCloseShift = this.buildBodyCloseShift(bodyVolumesHoses);
                  this.operatorService.closeShift(bodyCloseShift).subscribe(
                    value2 => {
                      this.preload = false;
                      this.loadingService.dismissLoading();
                      this.modalController.dismiss();
                      this.toastService.presentToastOk('Turno finalizado');
                      this.operatorService.resumeShift(bodyCloseShift).subscribe(
                        value3 => {
                          if(this.is_integrate_print){
                            this.print(value3);
                          }
                          console.log(value3);
                          this.openReprintClosingAlert(value3);
                        }
                      );
                      this.operatorService.clearShift();
                      //this.router.navigate(['operator']);
                      this.navCtrl.navigateRoot('operator');
                    },
                    (error: HttpErrorResponse) => {
                      this.preload = false;
                      if (error.status === 400 && error.error?.body?.message) {
                        this.errorMessageCloseShift = error.error?.body?.message;
                      } else {
                        this.toastService.presentToastError('No se logró finalizar el turno, por favor intente nuevamente');
                      }
                    }
                  );
                },
                error => {
                  this.preload = false;
                  this.toastService.presentToastError('No fué posible consultar el volumen de las mangueras, por favor intente nuevamente');
                }
              );
            } else {
              this.toastService.presentToastError('Las mangueras no están colgadas');
              this.preload = false;
            }
          },
          (error: HttpErrorResponse) => {
            this.preload = false;
            this.toastService.presentToastError('Error de conexión');
          }
        );
      }, error => {
        this.preload = false;
        this.toastService.presentToastError('Error de conexión');
      });
    } else {
      this.formControlDNI.markAsTouched();
      this.scrollToDNIField();
    }
  }

  private scrollToDNIField() {
    this.dniSection?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Mensaje de error cedula
   */
  getErrorMessageDNI() {
    return this.formControlDNI.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlDNI.hasError('minlength')
        ? 'Longitud mínima de 5 caracteres'
        : this.formControlDNI.hasError('maxlength')
          ? 'Longitud máxima de 15 caracteres'
          : this.formControlDNI.hasError('pattern')
            ? 'Solo se permiten caracteres numéricos'
            : '';
  }
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

  async print(data_json){
    console.log("print de cierre");
    if(this.is_integrate_print){
      console.log("si llego a impresora con print de cierre");
      await this.dataphoneService.startPrintCloseShift(data_json);
    }
  }

  async reprint(data_json) {
    if (this.is_integrate_print) {
      await this.print(data_json);
      return;
    }
    const idShift = data_json?.body?.shift?._id;
    if (!idShift) {
      this.toastService.presentToastError('No se logró reimprimir el cierre, por favor intente nuevamente');
      return;
    }
    const isle: Isle = this.operatorService.readLocalHostIsland();
    this.preload = true;
    this.startLoading();
    this.operatorService.printShift(idShift, { isle: isle.id_isle }).subscribe(
      () => {
        this.preload = false;
        this.toastService.presentToastOk('Copia del cierre enviada a la isla');
      },
      () => {
        this.preload = false;
        this.toastService.presentToastError('No se logró reimprimir el cierre, por favor intente nuevamente');
      }
    );
  }

  async openReprintClosingAlert(data_json) {
    const alert = await this.alertController.create({
      cssClass: 'alert-reprint-shift',
      header: '¿Desea imprimir nuevamente el cierre?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'alert-reprint-no'
        },
        {
          text: 'SÍ',
          cssClass: 'alert-reprint-yes',
          handler: () => {
            this.reprint(data_json);
          }
        }
      ]
    });

    await alert.present();
  }



}
