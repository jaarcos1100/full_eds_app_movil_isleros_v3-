import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../../services/operator/operator.service';
import {FormControl, Validators} from '@angular/forms';
import {ToastService} from '../../../../../services/toast/toast.service';
import {ModalController, NavParams} from '@ionic/angular';
import {Basket} from '../../../../../models/basket/Basket';
import {InfoProductsBasket} from '../../../../../models/product/product';

// const SERVER_URL = 'ws://54.82.57.60:3001/';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-quantity-product.component.html',
  styleUrls: ['./dialog-quantity-product.component.scss']
})
export class DialogQuantityProductComponent implements OnInit {
  preload = false;
  errorMessage: string;
  formControlQuantity: FormControl;
  public data: Basket = this.navParams.get('data');
  public listProductsForBuy: InfoProductsBasket[] = this.navParams.get('productsBuy');
  public listDependencyProducts: Basket[] = this.navParams.get('productsDependencyBuy');

  constructor(private operatorService: OperatorService, private toastService: ToastService, public modalController: ModalController,
              private navParams: NavParams) {
    console.log(this.data);
    this.formControlQuantity = new FormControl('',
      [Validators.required, Validators.minLength(1), Validators.maxLength(3), Validators.pattern('[0-9]+')]
    );
  }

  ngOnInit(): void {
  }

  /**
   * Mensaje de error cantidad
   */
  getErrorMessageQuantity() {
    return this.formControlQuantity.hasError('required')
      ? 'Este campo es obligatorio'
       : this.formControlQuantity.hasError('maxlength')
        ? 'Debe ingresar Máximo 3 dígitos'
          : this.formControlQuantity.hasError('pattern')
          ? 'Debe ingresar solo números'
          : '';
  }

  addProduct() {
    this.errorMessage = undefined;
    if (this.formControlQuantity.valid) {
      const indexProduct = this.listProductsForBuy.findIndex(pb => pb.product === this.data.product._id);
      if (indexProduct !== -1) {
        this.toastService.presentToastError('El producto ya ha sido agregado');
      } else {
        const quantity = this.formControlQuantity.value;
        if (quantity <= 0) {
          this.toastService.presentToastError('Debe ingresar un número mayor a 0');
          return;
        }
        if (this.data.stock >= quantity) {
          const productBasket: InfoProductsBasket = {
            product: this.data.product._id,
            name: this.data.product.name,
            price: this.data.product.value,
            quantity: +quantity
          };
          this.listProductsForBuy.push(productBasket);
          this.modalController.dismiss();
          this.toastService.presentToastOk('Producto agregado');
        } else {
          this.toastService.presentToastError('El producto no dispone de la cantidad suficiente');
        }
      }
    } else {
      this.formControlQuantity.markAsTouched();
    }
  }
}
