import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingCtrl: LoadingController) { }

  /**
   * Ventana de Carga
   */
  async presentLoading() {
    return await this.loadingCtrl.create({
      message: 'Cargando',
      cssClass: 'loading-dialog',
      spinner: 'bubbles'
    }).then(a => {
      a.present().then();
    });
  }

  /**
   * Retirar ventana de Carga
   */
  async dismissLoading() {
    return await this.loadingCtrl.dismiss().then(() => console.log(""));
  }
}
