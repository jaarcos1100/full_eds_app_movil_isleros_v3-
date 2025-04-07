import {Component} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {FormControl, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../services/toast/toast.service';
import {ModalController, NavController} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-close-shift.component.html',
  styleUrls: ['./dialog-close-shift.component.scss']
})
export class DialogCloseShiftComponent {
  preload = false;
  errorMessageCloseShift: string;
  formControlDNI: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[0-9]+')]
  );

  constructor(public navCtrl: NavController, private operatorService: OperatorService, private toastService: ToastService, public modalController: ModalController, private loadingService: LoadingService) {
  }

  private buildBodyVolumesHoses(hoses: any[]): any[] {
    const hoseVolumes = [];
    for (const volumeHose of hoses) {
      hoseVolumes.push({
        hose: volumeHose.hose._id,
        volume: volumeHose.hose.volume
      });
    }
    return hoseVolumes;
  }

  buildBodyCloseShift(bodyVolumesHoses: any[]) {
    return {
      id_shift: this.operatorService.readIsOpenShift()._id,
      user: this.formControlDNI.value,
      isle: this.operatorService.readLocalHostIsland()._id,
      hoses: bodyVolumesHoses
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

  public callServicesCloseTurn() {
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
            console.log(value);
            if (value.body.estado === 1) {
              this.operatorService.getVolumes(isle.id_isle).subscribe(
                (value1: any) => {
                  console.log(value1);
                  const bodyVolumesHoses = this.buildBodyVolumesHoses(value1.body);
                  console.log(bodyVolumesHoses);
                  const bodyCloseShift = this.buildBodyCloseShift(bodyVolumesHoses);
                  console.log(bodyCloseShift);
                  this.operatorService.closeShift(bodyCloseShift).subscribe(
                    value2 => {
                      console.log(value2);
                      this.preload = false;
                      this.loadingService.dismissLoading();
                      this.modalController.dismiss();
                      this.toastService.presentToastOk('Turno finalizado');
                      this.operatorService.resumeShift(bodyCloseShift).subscribe(
                        value3 => {
                          console.log(value3);
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
    }
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
}
