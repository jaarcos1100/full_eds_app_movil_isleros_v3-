import {Component, OnInit} from '@angular/core';
import {OperatorService} from '../../../../services/operator/operator.service';
import {InfoProductsBasket, Product, ProductsBasket} from '../../../../models/product/product';
import {FormControl, Validators} from '@angular/forms';
import {Basket} from '../../../../models/basket/Basket';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {DialogQuantityProductComponent} from './quantity-product/dialog-quantity-product.component';
import {ToastService} from '../../../../services/toast/toast.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {LocalStorageIpPortService} from '../../../../services/localStorageIpPort/local-storage-ip-port.service';
import {Global} from '../../../../models/global/global';
import {DialogBasketPlaqueComponent} from '../basket-plaque/dialog-basket-plaque.component';
import { Util } from 'src/app/util/Util';

@Component({
  selector: 'app-basket-sale',
  templateUrl: './basket-sale.component.html',
  styleUrls: ['./basket-sale.component.scss']
})
export class BasketSaleComponent implements OnInit {
  preload = true;
  errorMessage: string;
  errorMessageProduct: string;
  public listDependencyAllProducts: Basket[]; // Todos los productos de Canastilla
  public listDependencyFilterProducts: Basket[]; // Los productos de Canastilla que se muestran, en caso que haya filtros solo se tienen en cuenta los que cumplan con el filtro
  public listProductsForBuy: InfoProductsBasket[] = []; // Lista de Productos agregados para la Compra
  showInvoice: boolean;
  formControlNameOrCode: FormControl = new FormControl('',
    [Validators.maxLength(20)]
  );
  /**
   * En Desuso, por que esta acción se realiza a travez de un diálogo y no en este componente
   */
  listFormControlPrice: FormControl[];
  public pathToImage = LocalStorageIpPortService.readAddress() + Global.URL.pathToImage;
  public util = Util;

  constructor(public navCtrl: NavController, private operatorService: OperatorService, private modalController: ModalController, private alertController: AlertController, private loadingService: LoadingService, private toastService: ToastService) {
    this.getInfoBasket();
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
   * Consulta Productos de Canastilla y las existencias de cada uno
   */
  public getInfoBasket() {
    this.listDependencyAllProducts = [];
    this.preload = true;
    this.startLoading();
    this.errorMessage = undefined;
    this.listFormControlPrice = [];
    this.operatorService.getBasket().subscribe(
      (value: any) => {
        this.listDependencyFilterProducts = value.body.canastilla;
        // console.log(this.listDependencyFilterProducts);
        // this.listDependencyFilterProducts.push(...JSON.parse(JSON.stringify(this.listDependencyFilterProducts)));
        // this.listDependencyFilterProducts.push(...JSON.parse(JSON.stringify(this.listDependencyFilterProducts)));
        // this.listDependencyFilterProducts.push(...JSON.parse(JSON.stringify(this.listDependencyFilterProducts)));
        // this.listProductsForBuy.push({name: 'extra', quantity: 3, price: 3, product: this.listDependencyFilterProducts[0].product._id})
        if (this.listDependencyFilterProducts) {
          this.listDependencyAllProducts.push(...this.listDependencyFilterProducts);
        }
        this.preload = false;
        this.createFormControlsQuantity();
      },
      error => {
        this.preload = false;
        this.toastService.presentToastError('Fallo listando los productos, por favor intente nuevamente');
        this.errorMessage = 'Fallo listando los productos, por favor intente nuevamente';
      }
    );
  }

  ngOnInit(): void {

    // TO-DO
    // this.showInvoice = true;
  }

  /**
   * En Desuso, por que esta acción se realiza a travez de un diálogo y no en este componente
   */
  createFormControlsQuantity() {
    for (const product of this.listDependencyFilterProducts) {
      console.log(product);
      this.listFormControlPrice.push(new FormControl('',
        [Validators.required, Validators.minLength(1), Validators.maxLength(10)]
      ));
    }
  }

  /**
   * Mensaje de error cedula
   */
  getErrorMessagePlate() {
    return this.formControlNameOrCode.hasError('maxlength')
      ? 'Longitud máxima de 20 cacteres'
      : '';
  }

  /**
   * Acción al oprimir el botón Siguiente, envía la venta a la Base de Datos para crearla y redirige al componente para factuar
   */
  next() {
    this.preload = true;
    this.startLoading();
    this.errorMessageProduct = undefined;
    const plaqueBody = {
      plaque: this.operatorService.readLocalHostPlaque()
    };
    this.operatorService.validatePlaque(plaqueBody).subscribe(
      (value: any) => {
        //const vehicle = value.body;
        const productsBasket: ProductsBasket = {
          products: this.listProductsForBuy,
          total_value: this.getTotalPrice(),
          plaque: plaqueBody.plaque,
          isle: this.operatorService.readLocalHostIsland()._id
        };
        this.operatorService.buyInBasket(productsBasket).subscribe(
          (value1: any) => {
            const sale = value1.body?.sale;
            this.operatorService.saveIsBasketSale(true);
            this.operatorService.saveTotalPriceSale(productsBasket.total_value);
            this.operatorService.saveSaleID(sale?._id);
            this.showInvoice = true;
            this.preload = false;
            this.loadingService.dismissLoading();
            this.navCtrl.navigateRoot('operator/lobby/invoice');
          },
          error => {
            console.log(error);
            this.preload = false;
            this.toastService.presentToastError('Error al realizar la compra, intentelo nuevamente');
          }
        );
      },
      error => {
        this.toastService.presentToastError('Error registrando la placa, por favor intente nuevamente.');
        this.preload = false;
      }
    );
  }

  getSubTotalPrice() {
    let result = 0;
    for (const product of this.listProductsForBuy) {
      result += (+product.price * +product.quantity);
    }
    return result;
  }

  /**
   * Calcula Precio Total de Impuestos de la Venta
   */
  getTaxPrice() {
    let result = 0;
    for (const productBuy of this.listProductsForBuy) {
      const product = this.listDependencyAllProducts.find(p => p.product._id === productBuy.product).product;
      if (product.taxes?.length > 0) {
        for (const tax of product.taxes) {
          if (tax.type === 'P') {
            result += +(product.value * (+tax.rate / 100)).toFixed(3);
          } else if (tax.type === 'M') {
            result += +((product.value * +tax.rate) / 1000).toFixed(3);
          } else if (tax.type === 'F') {
            result += +tax.rate;
          }
        }
        result *= productBuy.quantity;
      }
    }
    return Math.round(result);
  }

  /**
   * Calcula Precio Total de Retenciones de la Venta, no tiene en cuenta las retenciones de la empresa ya que aún no se ha seleccionado
   * ninguna empresa
   */
  getWithholdingsPrice() {
    let result = 0;
    for (const productBuy of this.listProductsForBuy) {
      const product = this.listDependencyAllProducts.find(p => p.product._id === productBuy.product).product;
      if (product.withholdings?.length > 0) {
        for (const tax of product.withholdings) {
          if (tax.type === 'P') {
            result += +(product.value * (+tax.rate / 100)).toFixed(3);
          } else if (tax.type === 'M') {
            result += +((product.value * +tax.rate) / 1000).toFixed(3);
          } else if (tax.type === 'F') {
            result += +tax.rate;
          }
        }
        result *= productBuy.quantity;
      }
    }
    return Math.round(result);
  }

  /**
   * Precio total de la Venta sin tener encuenta descuentos ya que aún no se ha seleccionado ninguna empresa
   */
  getTotalPrice() {
    return Math.round(this.getSubTotalPrice() - this.getWithholdingsPrice() + this.getTaxPrice());
  }

  getPriceProduct(product: InfoProductsBasket) {
    return Math.round(+product.price * +product.quantity);
  }

  /**
   * En Desuso, por que esta acción se realiza a travez de un diálogo y no en este componente
   */
  addProduct(i: number) {
    this.errorMessage = undefined;
    if (this.listFormControlPrice[i].valid) {
      const indexProduct = this.listProductsForBuy.findIndex(pb => pb.product === this.listDependencyFilterProducts[i].product._id);
      if (indexProduct !== -1) {
        this.toastService.presentToastError('El producto ya ha sido agregado');
      } else {
        const quantity = this.listFormControlPrice[i].value;
        if (this.listDependencyFilterProducts[i].stock >= quantity) {
          const productBasket: InfoProductsBasket = {
            product: this.listDependencyFilterProducts[i].product._id,
            name: this.listDependencyFilterProducts[i].product.name,
            price: this.listDependencyFilterProducts[i].product.value,
            quantity
          };
          this.listProductsForBuy.push(productBasket);
        } else {
          this.toastService.presentToastError('El producto no dispone de la cantidad suficiente');
        }
      }
    } else {
      this.listFormControlPrice[i].markAsTouched();
    }
  }

  clearBasket() {
    this.listProductsForBuy.splice(0, this.listProductsForBuy.length);
  }

  screenTablet() {
    return screen.width < 768;
  }

  /**
   * Filtro de productos que cumplan con el filtro de nombre o código
   */
  filterProducts() {
    this.listDependencyFilterProducts = [];
    for (const basketProduct of this.listDependencyAllProducts) {
      if (basketProduct.product.name) {
        const nameProduct = basketProduct.product.name?.toLowerCase();
        const codeProduct = basketProduct.product.code?.toLowerCase();
        const valueSearch = this.formControlNameOrCode.value?.toLowerCase();
        if (nameProduct?.includes(valueSearch) || codeProduct?.includes(valueSearch)) {
          this.listDependencyFilterProducts.push(basketProduct);
        }
      }
    }
  }

  back() {
    this.navCtrl.navigateRoot('operator/lobby');
  }

  /**
   * Antes de abrir el modal para seleccionar la cantidad del producto verifica si el producto ya fué agregado, si hay existencias y si
   * aún no se ha alcanzado el límite de productos en 1 venta de Canastilla 3 (productos)
   */
  async openModalQuantityProduct(basketProduct: Basket) {
    const indexProduct = this.listProductsForBuy.findIndex(pb => pb.product === basketProduct.product._id);
    if (indexProduct !== -1) {
      this.toastService.presentToastError('El producto ya ha sido agregado');
      return;
    }
    if (this.listProductsForBuy.length >= 3) {
      this.toastService.presentToastError('No puede agregar más de 3 productos');
      return;
    }
    if (basketProduct.stock <= 0) {
      this.toastService.presentToastError('Este producto está agotado');
      return;
    }
    const modal = await this.modalController.create({
      component: DialogQuantityProductComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: basketProduct,
        productsBuy: this.listProductsForBuy,
        productsDependencyBuy: this.listDependencyFilterProducts
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        // this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

  async openAlertRemoveProduct(product: InfoProductsBasket) {
    const alert = await this.alertController.create({
      cssClass: 'alert-cancel-continue',
      header: 'Retirar Producto',
      message: '¿Retirar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          cssClass: 'alert-continue-button',
          handler: () => {
            const indexProduct = this.listProductsForBuy.findIndex(p => p.product === product.product);
            this.listProductsForBuy.splice(indexProduct, 1);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Retira cantidad de un producto cuando se oprime el botón con symbolo +
   */
  subtractQuantityProduct(infoProductsBasket: InfoProductsBasket) {
    if (infoProductsBasket.quantity > 1) {
      infoProductsBasket.quantity = (+infoProductsBasket.quantity) - 1;
    }
  }

  /**
   * Aumenta cantidad de un producto cuando se oprime el botón con symbolo +
   */
  addQuantityProduct(infoProductsBasket: InfoProductsBasket) {
    const productFilter = this.listDependencyAllProducts.find(p => p.product._id === infoProductsBasket.product);
    if (productFilter.stock >= ((+infoProductsBasket.quantity) + 1)) {
      infoProductsBasket.quantity = (+infoProductsBasket.quantity) + 1;
    } else {
      this.toastService.presentToastError('No puede agregar más cantidad');
    }
  }

  async openModalWritePlaque() {
    if (this.listProductsForBuy.length > 0) {
      const modal = await this.modalController.create({
        component: DialogBasketPlaqueComponent,
        cssClass: 'fullscreen',
        componentProps: {
        }
      });
      modal.onDidDismiss().then(res => {
        if (res.data === 'saved') {
          this.next();
        }
      }).catch();
      return await modal.present();
      // TODO
      // this.showInvoice = true;
    } else {
      this.toastService.presentToastError('Debe agregar algún producto a la canastilla');
    }
  }

  getProductImage(product: Product) {
    return product.image_selected ? this.pathToImage + product.image_selected : './assets/basket/default-product.svg';
  }

  /**
   * Retorna la imágen de cada producto, si el producto no tienen imágen entonces se usa una por defecto
   */
  getProductImageAdded(infoProductsBasket: InfoProductsBasket) {
    const productFilter = this.listDependencyAllProducts.find(p => p.product._id === infoProductsBasket.product);
    return productFilter.product.image_selected ? this.pathToImage + productFilter.product.image_selected : './assets/basket/default-product.svg';
  }

  getPriceTotalOfProduct(product: Product) {
    if (product?.value > 0) {
      return Math.round(product.value + product.taxes_price - product.withholdings_price);
    }
    return 0;
  }
}
