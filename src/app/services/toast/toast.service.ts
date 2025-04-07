import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async presentToastError(text: string) {
    const toast = await this.toastController.create({
      message: text,
      cssClass: 'font-toast',
      duration: 4000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  async presentToastOk(text: string) {
    const toast = await this.toastController.create({
      message: text,
      cssClass: 'font-toast',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }

  async presentToastWarning(text: string) {
    const toast = await this.toastController.create({
      message: text,
      cssClass: 'font-toast',
      duration: 4000,
      color: 'warning',
      position: 'top'
    });
    toast.present();
  }
}
