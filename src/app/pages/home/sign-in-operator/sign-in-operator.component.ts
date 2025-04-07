import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../services/operator/operator.service';
import {FormControl, Validators} from '@angular/forms';
import {OperatorLogin} from '../../../models/operator-login/OperatorLogin';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../services/toast/toast.service';
import {LoadingService} from '../../../services/loading/loading.service';
import {NavController} from '@ionic/angular';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-sign-in-operator',
  templateUrl: './sign-in-operator.component.html',
  styleUrls: ['./sign-in-operator.component.scss']
})
export class SignInOperatorComponent implements OnInit {
  preload = false;
  formControlDNI: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[0-9]+')]
  );

  constructor(public navCtrl: NavController, private operatorService: OperatorService, private toastService: ToastService, private loadingService: LoadingService) {
    const isle = operatorService.readLocalHostIsland();
    if (!isle) {
      this.navCtrl.navigateRoot('operator');
      return;
    }
  }

  ngOnInit(): void {
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

  /**
   * Acción cuando se oprime el botón Next, verifica si hay un usuario con Rol Islero en la Base de Datos con el documento que se ingresó,
   * si lo hay se redirige a la ventana de Resumen de Conbustible en Mangueras.
   */
  next() {
    // TODO
    // this.router.navigate(['operator/summary']);
    if (this.formControlDNI.valid) {
      this.startLoading();
      this.preload = true;
      const loginOperator: OperatorLogin = {
        isle: this.operatorService.readLocalHostIsland()._id,
        document: this.formControlDNI.value
      };
      this.operatorService.login(loginOperator).subscribe(
        (value: any) => {
          console.log(value);
          const user = value.body.user;
          localStorage.setItem('token', JSON.stringify(value.body.token));
          this.operatorService.getRolesUser().subscribe(
            (res) => {
              user.roles = res.body?.body?.roles;
              this.preload = false;
              this.stopLoading();
              this.operatorService.saveOperator(user);
              this.navCtrl.navigateRoot('operator/summary');
            },
            (err) => {
              this.preload = false;
              this.stopLoading();
              this.toastService.presentToastError('Error en la conexión, por favor intente nuevamente');
            }
          );
        },
        (error: HttpErrorResponse) => {
          this.toastService.presentToastError('3' + JSON.stringify(error));
          if (error.status === 400) {
            this.toastService.presentToastError('La cédula no se encuentra registrada o activada en la plataforma');
          } else {
            this.toastService.presentToastError('Error en la conexión, por favor intente nuevamente');
          }
          this.preload = false;
        }
      );
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

// const value = {
//   body: {
//     data: {
//       _id: 'asdasd',
//       document: '123123'
//     }
//   }
// };
