import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private pendingLoading: Promise<HTMLIonLoadingElement>;

  constructor(private loadingCtrl: LoadingController) { }

  /**
   * Ventana de Carga
   */
  presentLoading(): Promise<HTMLIonLoadingElement> {
    this.pendingLoading = this.loadingCtrl.create({
      message: 'Cargando',
      cssClass: 'loading-dialog',
      spinner: 'bubbles'
    }).then(async loading => {
      await loading.present();
      return loading;
    });
    return this.pendingLoading;
  }

  /**
   * Retirar ventana de Carga
   */
  async dismissLoading() {
    if (this.pendingLoading) {
      await this.pendingLoading;
      this.pendingLoading = undefined;
    }
    return await this.loadingCtrl.dismiss().then(() => console.log(""));
  }
}
