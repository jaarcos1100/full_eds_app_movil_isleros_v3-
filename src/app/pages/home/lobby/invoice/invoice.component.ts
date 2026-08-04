import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OperatorService } from '../../../../services/operator/operator.service';
import { UserDataInvoice } from '../../../../models/user-data-invoice/UserDataInvoice';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Payment } from '../../../../models/payment/Payment';
import { Sale } from '../../../../models/sale/sale';
import { User } from '../../../../models/user/user';
import { OrganizationsService } from '../../../../services/organizations/organizations.service';
import { GlobalVarService } from '../../../../services/globalVars/global-var-service';
import { CreditService } from '../../../../services/credits/credit-service.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ModalController, NavController } from '@ionic/angular';
import { DialogRegisterUserComponent } from './register-user/dialog-register-user.component';
import { Company } from '../../../../models/company/company';
import { LoadingService } from '../../../../services/loading/loading.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { RestrictionsService } from '../../../../services/restrictions/restrictions.service';
import { Restriction } from '../../../../models/restriction/restriction';
import { LocalStorageIpPortService } from '../../../../services/localStorageIpPort/local-storage-ip-port.service';
import { DataphoneService } from '../../../../services/dataphone/dataphone.service';
import { debounceTime, delay } from 'rxjs/operators';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  public current_step: number;// paso actual
  public isSelectUser: boolean;
  public formControlNIT: FormControl;
  public formControlKM: FormControl;
  public formAnticipate: FormControl;
  public userSelected: User | Company | any;
  private timer: number;
  public readonly typeCompany: TypeUser = {
    name: 'Empresa',
    valueBackground: 'company',
  };
  companiesAutocomplete: User[] | Company[] = [];
  public static readonly nitDummie = '22222222222';
  public userDataInvoice: UserDataInvoice;
  public currentUser: number; // User Seleccionado, por defecto es 0 que indica el Usuario Consumidor Final (osea Dummie)
  public currentInvoice: number;
  public currentInvoiceCode: string;
  public currentMethodPayment: number;
  public preloadInvoice: boolean = false;
  public lastUserCreated: User | Company;
  public errorMessage: string;
  public id_user_selected: string;
  public listTypeInvoices: any[];
  public listPayment: Payment[];
  public countCopies: number;
  public isBasketSale: boolean;
  public globalVar: any;
  public can_be_vale: boolean;
  public quota_value: number;
  public have_free_quota: boolean;
  public is_varios_user: boolean;
  public total_sale: number;
  public restriction: Restriction;
  public limit_uvt: boolean;
  public is_vale: boolean;
  public is_cupo: boolean;
  private companyDummie: Company;
  static typeSaleFreeQuota = 4;
  public minLengthEmail = 5;
  public mandatory_print: boolean;
  public require_print: boolean;
  public enableReturnStep2: boolean;
  public has_anticipate: boolean;
  public balance_anticipate: number;
  public data_invoice: any;
  public payWithCard: boolean;

  public is_dataphone: boolean;
  public is_integrate_print: boolean;

  public formControlTotalValue: FormControl;
  public relative_taxes_dataphone_payment: number;

  public result_code_datafone: any;

  private original_tax_percent: number | null = null; // porcentaje fijo inicial

  private shift_id: string = "";

  public max_ammount_dataphone: number;
  public organizationId: string;
  public is_lite: boolean;
  constructor(private operatorService: OperatorService, private organizationService: OrganizationsService, private toastService: ToastService, private modalController: ModalController, private loadingService: LoadingService, public navCtrl: NavController, public globalVarService: GlobalVarService, public creditService: CreditService, public restrictionsService: RestrictionsService, public dataphoneService: DataphoneService) {
    if (!operatorService.readSaleID()) {
      navCtrl.navigateRoot('operator/lobby/tankers');
      return;
    }
    this.getGlobalVar();
    this.getDetailsCar();
    this.isBasketSale = operatorService.readIsBasketSale() == 'true';
    this.current_step = 1;// empieza en 1, termina en 3
    this.formControlNIT = new FormControl('',
      [Validators.minLength(3), Validators.maxLength(120)]
    );
    this.currentUser = 1;// posicion de usuario actual
    this.currentInvoice = 0;//  posicion de tipo de factura 
    this.errorMessage = '';
    this.currentMethodPayment = 0;// metodo actual de pago
    this.setListPayment();
    this.setListTypeInvoice();
    this.countCopies = 0; // cantidad de copias 
    this.can_be_vale = true; // si puede ser vale
    this.have_free_quota = false;//si la empresa actual tiene cupo libre
    this.is_varios_user = true;// si es el usuario 22222222222
    this.quota_value = 0;// credito de la empresa
    this.total_sale = this.operatorService.readTotalPriceSale();
    this.restriction = new Restriction();
    this.restriction.type_sold = 'none';
    this.restriction.is_cupo = false;
    this.restriction.is_vale = false;
    this.restriction.require_print = false;
    this.limit_uvt = false;
    this.currentInvoiceCode = 'pos';
    this.is_cupo = false;
    this.is_vale = false;
    this.has_anticipate = false;
    this.formControlKM = new FormControl('',
      [Validators.minLength(1), Validators.maxLength(20), Validators.pattern('[-]?[0-9]+(\\.[0-9]+)?$')]
    );

    this.formAnticipate = new FormControl('',
      [Validators.minLength(1), Validators.maxLength(10000), Validators.pattern('[-]?[0-9]+(\\.[0-9]+)?$')]
    );

    this.formControlTotalValue = new FormControl('',
      [Validators.minLength(1), Validators.maxLength(1000000), Validators.pattern('[-]?[0-9]+(\\.[0-9]+)?$')]
    );
    this.relative_taxes_dataphone_payment = 0;

    this.is_lite = LocalStorageIpPortService.getIsFullEDSLite() == true ? true : false;
    this.mandatory_print = false;
    this.require_print = !this.is_lite;
    this.enableReturnStep2 = true;
    this.data_invoice = {};
    this.payWithCard = false;
    this.is_dataphone = LocalStorageIpPortService.getIsDatafono() == true ? true : false;
    this.is_integrate_print = LocalStorageIpPortService.getIsPrint() == true ? true : false;
    this.result_code_datafone = 'None';
    this.max_ammount_dataphone = 0;
    this.shift_id = this.operatorService.readIsOpenShift()._id;
  }

  ngOnInit() {
    this.listenDataphoneValue();
    this.loadOrganizationId();
  }

  loadOrganizationId() {
    // Obtener organizationId desde el isleSummary (producto de las mangueras)
    const isleSummary = this.operatorService.readLocalHostIsleSummary();
    if (isleSummary?.hoses?.length > 0 && isleSummary.hoses[0]?.product?.organization) {
      const org = isleSummary.hoses[0].product.organization;
      this.organizationId = typeof org === 'string' ? org : org._id;
      console.log('Organization ID cargado desde isleSummary:', this.organizationId);
    } else {
      console.warn('No se pudo obtener el organizationId desde isleSummary');
    }
  }

  setListTypeInvoice() {
    this.listTypeInvoices = [
      { icon: 'receipt-outline', name: 'POS', option_name: 'none', option: false, code: 'pos' },
      { icon: 'cloud-upload', name: 'FACTURA ELECTRÓNICA', option_name: 'venta_vale', option: true, code: 'fe' },
      { icon: 'cube', name: 'CUPO', option_name: 'cupo_libre', option: true, code: 'cupo' },
    ];
  }

  //enum: ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'CHEQUE']
  setListPayment() {
    this.listPayment = [
      { icon: 'cash-outline', code: 10, name: 'Efectivo' },
      { icon: 'card-outline', code: 48, name: 'Tarjeta Crédito' },
      { icon: 'card-outline', code: 49, name: 'Tarjeta Débito' },
      { icon: 'phone-portrait-outline', code: 30, name: 'Transferencia credito' },
      { icon: 'newspaper-outline', code: 20, name: 'Cheque' },
    ];
  }

  changeUsersAutocomplete() {
    if (this.isSelectUser) {
      this.isSelectUser = false;
      return;
    }
    this.userSelected = undefined;
    this.formControlNIT.markAsTouched();
    if (this.formControlNIT.valid && this.formControlNIT.value?.toString()?.length > 0) {
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
      this.timer = window.setTimeout(() => {
        const type = this.typeCompany.valueBackground;
        const searchUserOrCompany = {
          type,
          identification: this.formControlNIT.value,
          organization: this.organizationId,
        };
        this.operatorService.searchUserOrCompany(searchUserOrCompany, 0, 5).subscribe(
          (value: HttpResponse<any>) => {
            this.companiesAutocomplete = value.body.companies;
          }
        );
      }, AppComponent.timeMillisDelayFilter);
    } else {
      this.companiesAutocomplete = [];
    }
  }

  /**
   * Consulta Información del vehículo dueño de la venta, para verificar las empresas asociadas a este
   */
  public getDetailsCar() {
    this.startLoading();
    this.errorMessage = undefined;
    this.userDataInvoice = undefined;
    const plaque = {
      plaque: this.operatorService.readLocalHostPlaque()
      // plaque: 'MQX18C'
    };
    this.operatorService.getVehicleDetails(plaque).subscribe(
      (value: any) => {
        // Se apaga el spinner de una vez: si algo más abajo lanza una excepción
        // (respuesta con forma inesperada), el spinner no debe quedar colgado.
        this.preloadInvoice = false;
        try {
          this.userDataInvoice = value.body;
          this.currentUser = 0;
          const companies = this.userDataInvoice?.companies;
          if (companies && this.lastUserCreated) {
            // @ts-ignore
            this.currentUser = companies.findIndex(c => c.nit === this.lastUserCreated.nit || c.nit === this.lastUserCreated.document);
            if (this.currentUser === -1) {
              this.currentUser = 0;
            }
          }
        } catch (e) {
          console.log(e);
          this.errorMessage = 'Error obteniendo los datos de la factura, intente nuevamente';
          this.toastService.presentToastError('Error obteniendo los datos de la factura, intente nuevamente');
        }
      },
      (error: HttpErrorResponse) => {
        this.preloadInvoice = false;
        if (error.status === 400) {
          this.toastService.presentToastError('La placa no se encuentra registrada');
          this.errorMessage = 'La placa no se encuentra registrada';
        } else {
          this.toastService.presentToastError('Error obteniendo los datos de la factura, intente nuevamente');
          this.errorMessage = 'Error obteniendo los datos de la factura, intente nuevamente';
        }
      }
    );
  }


  private startLoading() {
    this.preloadInvoice = true;
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  stopLoading() {
    const interval = setInterval(() => {
      if (this.preloadInvoice === false) {
        this.loadingService.dismissLoading();
        clearInterval(interval);
      }
    }, 100);
  }

  registerUser() {
    this.openModalRegisterUser();
  }

  async openModalRegisterUser() {
    const modal = await this.modalController.create({
      component: DialogRegisterUserComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: 1
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data) {
        this.lastUserCreated = res.data;
        this.getDetailsCar();
      }
    }).catch();
    return await modal.present();
  }

  /**
   * Mensaje de error NIT
   */
  getErrorMessageNit() {
    return this.formControlNIT.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlNIT.hasError('minlength')
        ? 'Longitud mínima de 3 cacteres'
        : this.formControlNIT.hasError('maxlength')
          ? 'Longitud máxima de 120 cacteres'
          : '';
  }

  onSelectOption(option: User | Company | any) {
    this.userSelected = option;
    this.isSelectUser = true;

    // Si es cliente de FullSuit y NO tiene _id (es decir, no ha sido creado localmente aún)
    if (option.from_fullsuit && !option._id) {
      this.createFullSuitClientLocally(option);
      return; // Salir, el resto se maneja en el callback del subscribe
    }

    // Para clientes locales o que ya han sido creados, continuar normalmente
    this.getRestriction(option._id);
    this.balance_anticipate = option.anticipateBalance;

    const indexCompany = this.userDataInvoice?.companies.findIndex(c => c._id === option._id);
    if (indexCompany !== -1) {
      this.currentUser = indexCompany;
      this.moveScrollListToElement(this.currentUser);
    } else {
      this.userDataInvoice.companies.push(option);
      this.currentUser = this.userDataInvoice.companies.length - 1;
      this.moveScrollListToElement(this.currentUser);
    }
  }

  /**
   * Crea un cliente de FullSuit en la base de datos local
   */
  createFullSuitClientLocally(option: any) {
    const fullSuitData = option.full_suit_raw;

    const body = {
      name: fullSuitData?.names || option.name,
      nit: fullSuitData?.nit || option.nit,
      emails: fullSuitData?.email ? [fullSuitData.email] : option.emails,
      phones: fullSuitData?.phone ? [fullSuitData.phone] : option.phones,
      type: 'company',
      plaque: this.operatorService.readLocalHostPlaque(),
      digit_check: fullSuitData?.digitVerification?.toString() || option.digit_check || '0',
      address: fullSuitData?.address || '',
      from_fullsuit: true
    };

    this.startLoading();
    this.operatorService.registerUser(body).subscribe(
      (value: any) => {
        this.preloadInvoice = false;
        const createdClient = value.body?.user || value.body?.company;
        const clientId = createdClient?._id;
        if (!clientId) {
          this.toastService.presentToastError('No se pudo obtener el ID del cliente creado');
          return;
        }
        // Buscar el cliente por su _id para obtenerlo como un cliente normal
        const searchBody = {
          type: 'company',
          identification: createdClient.nit || createdClient.document,
        };
        this.operatorService.searchUserOrCompany(searchBody, 0, 1).subscribe(
          (searchResult: any) => {
            const companies = searchResult.body?.companies || [];
            const found = companies.find(
              c => String(c.nit) === String(createdClient.nit || createdClient.document)
            );
            console.log(found)
            if (found) {
              this.userDataInvoice.companies.push(found);
              this.currentUser = this.userDataInvoice.companies.length - 1;
              this.getRestriction(found._id);
              this.balance_anticipate = found.anticipateBalance;
              this.toastService.presentToastOk('Cliente de FullSuit creado exitosamente');
              this.moveScrollListToElement(this.currentUser);
            } else {
              this.toastService.presentToastError('No se pudo cargar el cliente recién creado');
            }
          },
          (err) => {
            this.toastService.presentToastError('Error al buscar el cliente recién creado');
          }
        );
      },
      (error: any) => {
        this.preloadInvoice = false;
        if (error.status === 400 && (error?.error?.body?.errors?.nit || error?.error?.body?.message?.includes('nit'))) {
          this.toastService.presentToastError('El NIT ya existe en la base de datos local');
          this.addExistingClientToList(option);
        } else {
          this.toastService.presentToastError('Error al crear el cliente, intente nuevamente');
        }
      }
    );
  }

  /**
   * Agrega un cliente existente a la lista cuando ya existe en BD local
   */
  addExistingClientToList(option: any) {
    // Buscar el cliente en la BD local por NIT
    const searchBody = {
      type: 'company',
      identification: option.nit
    };

    this.operatorService.searchUserOrCompany(searchBody, 0, 5).subscribe(
      (value: any) => {
        const companies = value.body?.companies || [];
        // Buscar el cliente local
        const localClient = companies.find(c => String(c.nit) === String(option.nit));

        if (localClient) {
          // Verificar si ya está en la lista
          const indexExisting = this.userDataInvoice?.companies.findIndex(c => c._id === localClient._id);
          if (indexExisting !== -1) {
            this.currentUser = indexExisting;
          } else {
            this.userDataInvoice.companies.push(localClient);
            this.currentUser = this.userDataInvoice.companies.length - 1;
          }

          this.getRestriction(localClient._id);
          this.balance_anticipate = localClient.anticipateBalance;
          this.moveScrollListToElement(this.currentUser);
          this.toastService.presentToastOk('Cliente seleccionado');
        } else {
          this.toastService.presentToastError('No se encontró el cliente local');
        }
      },
      (error) => {
        this.toastService.presentToastError('Error al buscar el cliente');
      }
    );
  }

  moveScrollListToElement(index) {
    const element: HTMLElement = document.getElementById('list_clients');
    const itemOfList = element.children[index];
    itemOfList.scrollIntoView();
  }

  goToStep1() {
    this.current_step = 1;
  }

  goToStep2() {
    this.getRestriction(this.userDataInvoice.companies[this.currentUser]._id)
    setTimeout(() => {
      this.current_step = 2;
    }, 1000);

  }

  goToStep3() {
    this.current_step = 3;
    this.formAnticipate.reset();
  }

  findAndRemoveByAttribute(list, attribute, value) {
    // Encuentra el índice del elemento en la lista.
    const index = list.findIndex(item => item[attribute] === value);

    // Si el índice es -1, el elemento no se encontró en la lista.
    if (index !== -1) {
      // El método splice() cambia el contenido del array, eliminando elementos existentes y/o agregando nuevos elementos.
      list.splice(index, 1);  // splice devuelve un array con el elemento eliminado
      return list
    }

    // Si no se encontró el elemento, se podría devolver null o manejarlo de cualquier otra manera que se desee.
    return null;
  }

  buildStep2() {
    //this.is_cupo = false;
    //this.is_vale = false;
    this.have_free_quota = this.haveFreeQuotaCurrentCompany();
    this.is_varios_user = this.isVariosUsers();
    this.quota_value = this.quotaCurrentCompany();

    //valida si es usuario es 22222222222 o si la venta  para quitar opcion cupo

    this.setListTypeInvoice();

    this.currentInvoiceCode = 'pos';
    this.currentInvoice = 0;

    if (this.is_varios_user || this.quota_value < this.total_sale) {
      this.listTypeInvoices = this.findAndRemoveByAttribute(this.listTypeInvoices, 'name', 'CUPO')
    }

    if (this.limit_uvt == true) {
      this.listTypeInvoices = this.findAndRemoveByAttribute(this.listTypeInvoices, 'name', 'POS')
    }

    if (this.is_varios_user == true && this.limit_uvt == true) {
      this.currentInvoiceCode = 'fe';
    } else if (this.is_varios_user == false && this.limit_uvt == true) {
      this.currentInvoiceCode = 'fe';
    } else {
      this.currentInvoiceCode = 'pos';
    }

    if (this.restriction && this.restriction.type_sold != 'none') {
      this.currentInvoiceCode = this.restriction.type_sold;
    }
  }

  chooseClient(user, i) {
    this.balance_anticipate = user.anticipateBalance;
    this.currentUser = i;
    //this.getRestriction(user._id);
  }

  chooseMethodType(i) {
    this.currentMethodPayment = i;
  }

  chooseInvoiceType(i, code) {
    this.currentInvoice = i;
    this.currentInvoiceCode = code;

  }

  isVariosUsers() {
    return this.currentUser == 0 ? true : false;
  }

  /**
   * Verifica si esta venta que se va a facturar ya fué impresa en su factura original o copia
   */
  readCountCopiesForThisSale() {
    const recordInvoice = this.operatorService.readRecordCopiesInvoice();
    if (recordInvoice && recordInvoice.length > 0) {
      const findRecordSale = recordInvoice.find(r => r._idInvoicePrinted === this.operatorService.readSaleID());
      if (findRecordSale) {
        this.countCopies = findRecordSale.numberCopies;
      }
    }
  }

  // lista las variables globales para validar el UVT
  getGlobalVar() {
    let total_sale = this.operatorService.readTotalPriceSale();
    this.globalVarService.getGlobalVar().subscribe(
      (value: any) => {

        this.globalVar = value.body.globalVars[0];
        let min_to_fact_electronic = this.globalVar.uvt_quantity * this.globalVar.uvt_value;
        if (total_sale >= min_to_fact_electronic) {
          this.limit_uvt = true;
        }
        this.mandatory_print = false;
        if (this.globalVar.require_print && !this.is_lite) {
          this.mandatory_print = true;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // lista las restricciones de cada empresa
  getRestriction(company_id) {
    debugger;
    this.is_cupo = false;
    this.is_vale = false;
    this.restrictionsService.getRestrictions(company_id).subscribe(
      (value: any) => {
        if (value.body.restrictions.length > 0) {
          this.restriction = value.body.restrictions[0];

          if ((this.restriction.type_sold == 'fe' && this.restriction.is_vale == true) || this.restriction.type_sold == 'cupo') {
            this.currentMethodPayment = 0;
          }

          if (this.restriction.type_sold == 'fe' && this.restriction.is_vale == true) {
            this.is_vale = true;
          } else if (this.restriction.type_sold == 'cupo' && this.restriction.is_cupo == true) {
            this.is_cupo = true;
          }


          if (this.is_lite) {
            this.mandatory_print = false;
            this.require_print = false;
          } else if (!this.globalVar.require_print) {
            if (this.restriction.require_print) {
              this.mandatory_print = true;
              this.require_print = true;
            } else {
              this.mandatory_print = false;
              this.require_print = true;
            }
          } else {
            this.require_print = true;
          }

          if (this.restriction.allow_anticipate) {
            this.has_anticipate = this.restriction.allow_anticipate;
          } else {
            this.has_anticipate = false;
          }
        } else {
          this.restriction.type_sold = 'none';
          this.restriction.is_cupo = false;
          this.restriction.is_vale = false;
          this.restriction.require_print = false;
          this.restriction.allow_anticipate = false;
          this.restriction.anticipate_max_value = 0;
          this.is_vale = false;
          this.is_cupo = false;

          this.getGlobalVar();
        }
        this.buildStep2();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Verifica si la empresa configurado tiene Cupo Libre
   */
  haveFreeQuotaCurrentCompany() {
    let have_free_quota = this.currentUser > 0 && this.restriction?.type_sold === 'cupo';
    return have_free_quota;
  }

  /**
   * Verifica si la empresa configurado tiene Cupo Libre
   */
  quotaCurrentCompany() {
    let quota = this.currentUser > 0 && this.userDataInvoice.companies[this.currentUser].credit != undefined ? this.userDataInvoice.companies[this.currentUser].credit : 0;
    return quota;
  }

  /**
   * Mensaje de error kilometraje
   */
  getErrorMessageKM() {
    return this.formControlKM.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlKM.hasError('minlength')
        ? 'Longitud mínima de 1 caracteres'
        : this.formControlKM.hasError('maxlength')
          ? 'Longitud máxima de 20 caracteres'
          : this.formControlKM.hasError('pattern')
            ? 'Solo se permiten caracteres numéricos'
            : '';
  }


  buildSaleToInvoiceCopy() {
    const sale: any = {
      is_basket: this.isBasketSale,
      type: this.is_cupo ? InvoiceComponent.typeSaleFreeQuota : this.findCurrentInvoice(),
      is_copy: true,
      isle: this.operatorService.readLocalHostIsland().id_isle,
      require_print: this.require_print
    };
    return sale;
  }

  buildSaleToInvoice() {
    const sale: any = {
      is_basket: this.isBasketSale,
      type: this.is_cupo ? InvoiceComponent.typeSaleFreeQuota : this.findCurrentInvoice(),
      is_copy: false,
      isle: this.operatorService.readLocalHostIsland().id_isle,
      payment_method: this.listPayment[this.currentMethodPayment].code,
      require_print: this.require_print,
      shift_id: this.shift_id
    };
    if (this.formControlKM.value) {
      sale.mileage = this.formControlKM.value;
    }

    sale.company = this.getIdCompany();
    sale.is_vale = this.is_vale;
    if (this.has_anticipate && parseInt(this.formAnticipate.value) > 0) {
      sale.anticipate = parseInt(this.formAnticipate.value);
    }
    return sale;
  }

  getIdCompany() {
    //if (this.currentUser !== 0) {
    const companies = this.userDataInvoice.companies;
    const company = companies[this.currentUser];
    return company._id;
    //}
    //return this.companyDummie._id;
  }

  // La función findIndexByCode toma el arreglo y un código y devuelve el índice del objeto que tiene ese código.
  // Si no se encuentra, devuelve -1.
  findCurrentInvoice() {
    return this.currentInvoiceCode == 'pos' ? 1 : this.currentInvoiceCode == 'fe' ? 2 : this.currentInvoiceCode == 'cupo' ? 3 : 1;
  }

  getFullCompany() {


    const companies = this.userDataInvoice.companies;
    const company = companies[this.currentUser];
    return company;

  }

  /**
   * Llama al servicio para Facturar
   *
   * Luego de facturar la venta se llama a los servicios para reenvío de Ventas (ventas en las que hubo error en el envío) e Email (email con
   * las información de la venta y que no fué enviada a los clientes que realizaron compras)
   */
  toInvoiceService() {
    // this.errorMessageInvoice = undefined;
    debugger;
    let body;
    if (this.countCopies === 0) {
      body = this.buildSaleToInvoice();
    } else {
      body = this.buildSaleToInvoiceCopy();
    }

    body.is_dataphone = this.is_dataphone;
    body.is_integrate_print = this.is_integrate_print;

    this.operatorService.toInvoice(this.operatorService.readSaleID(), body).subscribe(
      async value => {
        this.data_invoice = value;

        this.setDataphoneData();
        console.log("-----------------------");
        console.log(this.data_invoice);
        console.log(this.data_invoice.body.data);
        console.log("-----------------------");

        this.preloadInvoice = false;
        this.enableReturnStep2 = false;
        this.deleteInvoice();
        this.countCopies++;
        this.validaDataphone();

        this.toastService.presentToastOk('Factura realizada.');
        this.forwardInvoicesAndEmails();
        await this.print(this.data_invoice.body.data);
        if (this.countCopies === 2 || (this.require_print == false && this.is_dataphone == false)) {

          this.deleteRecordCopiesForThisSale();


          this.preloadInvoice = false;
          //this.stopLoading();
          setTimeout(() => {
            if (this.isBasketSale) {
              this.navCtrl.navigateRoot('operator/lobby/pos');
            } else {
              this.navCtrl.navigateRoot('operator/lobby/tankers');
            }
          }, 300);

        } else if (this.is_dataphone) {
          this.addCountRecordCopiesFotThisSale();
        }
        //this.updateSalesInCloud();


      },
      (error: HttpErrorResponse) => {
        const errMessage = error.error.body?.message;
        console.log(error.error);
        this.preloadInvoice = false;
        this.forwardInvoicesAndEmails();
        if (error.status === 401 || error.status === 403) {
          this.toastService.presentToastError('Tu turno ha caducado, por favor inicia sesión nuevamente.');
        } else if (error.error?.body?.status == 500) {
          this.deleteInvoice();
          this.countCopies++;
        } else if (errMessage === 'NOT_ENOUGH_CREDIT') {
          this.toastService.presentToastError('La empresa no tiene crédito suficiente.');
        } else {
          this.toastService.presentToastError('Error al facturar, por favor intente nuevamente.');
        }
        // this.errorMessageInvoice = 'Error al facturar, por favor intente neuvamente.';
      }
    );
  }

  /*
  updateSalesInCloud(){
    this.creditService.updateCustomerInCloud(this.getIdCompany()).subscribe(
      value => {
        console.log("cliente actualziado en la nube");
      },
      err => {
        console.log(err);
      });
  }
  */

  outOfInvoice() {
    this.preloadInvoice = false;
    if (this.isBasketSale) {
      this.navCtrl.navigateRoot('operator/lobby/pos');
    } else {
      this.navCtrl.navigateRoot('operator/lobby/tankers');
    }
  }

  /**
   * Aumenta la cantidad de Ventas Impresas de la venta que se está facturando
   */
  addCountRecordCopiesFotThisSale() {
    let recordCopiesInvoice = this.operatorService.readRecordCopiesInvoice();
    if (recordCopiesInvoice && recordCopiesInvoice.length > 0) {
      const findRecordSale = recordCopiesInvoice.find(r => r._idInvoicePrinted === this.operatorService.readSaleID());
      if (findRecordSale) {
        findRecordSale.numberCopies = this.countCopies;
      } else {
        recordCopiesInvoice.push({ _idInvoicePrinted: this.operatorService.readSaleID(), numberCopies: this.countCopies });
      }
      this.operatorService.saveRecordCopiesInvoice(recordCopiesInvoice);
    } else {
      recordCopiesInvoice = [];
      recordCopiesInvoice.push({ _idInvoicePrinted: this.operatorService.readSaleID(), numberCopies: this.countCopies });
      this.operatorService.saveRecordCopiesInvoice(recordCopiesInvoice);
    }
  }

  /**
   * Cuando se termina de facturar una venta entonces se elimina del registro que cuenta la cantidad de veces que se ha impresa una venta
   */
  private deleteRecordCopiesForThisSale() {
    const recordCopiesInvoice: RecordCopyInvoice[] = this.operatorService.readRecordCopiesInvoice();
    if (recordCopiesInvoice && recordCopiesInvoice.length > 0) {
      const indexSaleInvoiced = recordCopiesInvoice.findIndex(r => r._idInvoicePrinted === this.operatorService.readSaleID());
      if (indexSaleInvoiced !== -1) {
        recordCopiesInvoice.splice(indexSaleInvoiced, 1);
        this.operatorService.deleteSaleID();
        this.operatorService.saveRecordCopiesInvoice(recordCopiesInvoice);
      }
    }
  }

  // reb envio de mensajes de correo electronico y de facturas
  private forwardInvoicesAndEmails() {
    console.log("sin ingreso a re envio de facturas");
    this.preloadInvoice = false;
    this.operatorService.forwardInvoice().subscribe(
      value => { },
    );
    this.operatorService.forwardEmails().subscribe(
      value => { },
    );

    this.operatorService.forwardInvoiceToSysplus().subscribe(
      value => { },
    );

    this.operatorService.forwardInvoiceToFullSuit().subscribe(
      value => { },
    );

    this.operatorService.forwardInvoiceAdjusmentToFullSuit().subscribe(
      value => { },
    );

    this.operatorService.forwardAnulateInvoiceToFullSuit().subscribe(
      value => { },
    );

  }

  private deleteInvoice() {
    if (this.countCopies === 0) {
      const sales: Sale[] = this.operatorService.readListSalesToPrint();
      if (sales) {
        const indexSaleInvoiced = sales.findIndex(s => s._id === this.operatorService.readSaleID());
        if (indexSaleInvoiced !== -1) {
          sales.splice(indexSaleInvoiced, 1);
          this.operatorService.saveListSalesToPrint(sales);
        }
      }
    }
  }

  /**
   * Acción que se ejecuta al oprimir el botón para Facturar, verifica el tipo de venta y de acuerdo a eso realiza una acción determinada,
   * por ejemplo si es una venta POS o Electrónica entonces llama a un servicio para verificar si hay Resolución para la empresa facturadora
   */
  finish() {
    if (this.has_anticipate) {
      if (parseInt(this.formAnticipate.value) > this.restriction.anticipate_max_value) {
        this.showSuccessErrorAlert('El valor del anticipo no puede ser superior al valor autorizado');
        return;
      }

      if (parseInt(this.formAnticipate.value) > this.balance_anticipate) {
        this.showSuccessErrorAlert('El valor del anticipo no puede ser superior al balance disponible de la empresa');
        return;
      }
    }


    if (this.formControlKM.valid) {
      if (this.is_cupo) { // free quota
        this.startLoading();
        this.toInvoiceService();
        return;
      }
      if (this.currentInvoiceCode === 'cupo') {// cupo
        this.startLoading();
        if (this.countCopies > 0) {
          this.toInvoiceService();
          return;
        }
        this.toInvoiceService();
      } else {
        if (this.currentInvoiceCode === 'pos') {// pos
          this.startLoading();
          this.organizationService.getValidateInfo().subscribe(res => {

            if (res.status == 200) {
              const response = res.body.body;
              if (!response.resolutionp) {
                this.preloadInvoice = false;
                this.showSuccessErrorAlert('No hay resolución POS en la estación.');
              } else {
                this.toInvoiceService();
              }
            } else {
              this.preloadInvoice = false;
              this.toastService.presentToastError('Error al facturar, por favor intente nuevamente.');
            }
          },
            (error1: HttpErrorResponse) => {
              this.preloadInvoice = false;
              if (error1.status === 401 || error1.status === 403) {
                this.toastService.presentToastError('Tu turno ha caducado, por favor inicia sesión nuevamente.');
              } else {
                this.toastService.presentToastError('Error al facturar, por favor intente nuevamente.');
              }
            });
        } else if (this.currentInvoiceCode === 'fe') {// factura electronica
          const selectedCompany = this.getFullCompany();
          if (!selectedCompany?.emails || selectedCompany.emails.length === 0 || !selectedCompany.emails[0] || selectedCompany.emails[0].toString().length < this.minLengthEmail) {
            this.showSuccessErrorAlert('La compañia seleccionada no tiene correo electrónico.');
            return;
          }
          this.startLoading();
          this.organizationService.getValidateInfo().subscribe(res => {

            if (res.status == 200) {
              const response = res.body.body;
              if (!response.resolution) {
                this.preloadInvoice = false;
                this.showSuccessErrorAlert('No hay resolución de Factura Electrrónica en la estación.');
              } else {
                this.toInvoiceService();
              }
            } else {
              this.preloadInvoice = false;
              this.toastService.presentToastError('Error al facturar, por favor intente nuevamente.');
            }
          },
            (error1: HttpErrorResponse) => {
              this.preloadInvoice = false;
              if (error1.status === 401 || error1.status === 403) {
                this.toastService.presentToastError('Tu turno ha caducado, por favor inicia sesión nuevamente.');
              } else {
                this.toastService.presentToastError('Error al facturar, por favor intente nuevamente.');
              }
            });
        }
      }
    } else {
      this.formControlKM.markAsTouched();
    }
  }

  finishCopy() {
    this.countCopies = 1;
    this.require_print = true;
    this.finish();
  }

  showSuccessErrorAlert(message: string) {
    this.toastService.presentToastError(message);
  }

  validaDataphone() {
    debugger;
    //console.log("copies:" + this.countCopies, "metodo de pago: "+ this.listPayment[this.currentInvoice].code, "es datafono: "+this.is_dataphone);
    if (this.countCopies == 1 && (this.listPayment[this.currentMethodPayment].code == 10 || this.listPayment[this.currentMethodPayment].code == 48 || this.listPayment[this.currentMethodPayment].code == 49) && this.is_dataphone) {
      this.payWithCard = true;
    }
    //console.log("pago con tarjeta " + this.payWithCard);
  }
  async payWithDataphone() {
    //this.max_ammount_dataphone = Math.round(this.data_invoice.body.total);
    let last_ammount_selected = parseInt(this.formControlTotalValue.value);

    if (last_ammount_selected > this.max_ammount_dataphone) {
      this.toastService.presentToastError("El valor pagado por datafono no puede ser superior al saldo total");
    } else if (last_ammount_selected < 1) {
      this.toastService.presentToastError("El valor pagado por datafono no puede ser menor a $1");
    } else {
      let dataTransfern = {
        amount: String(last_ammount_selected),
        tax: String(this.relative_taxes_dataphone_payment),
        tip: "0",
        iac: "0",
      };

      let response_from_account = await this.dataphoneService.startSellTransaction(dataTransfern);
      this.result_code_datafone = response_from_account.resultCode == undefined ? "" : response_from_account.resultCode;
      if (this.result_code_datafone == "6000" || this.result_code_datafone == 6000) {
        this.toastService.presentToastOk("La transaccion ha sido exitosa");
        this.max_ammount_dataphone = this.max_ammount_dataphone - last_ammount_selected;
      } else {
        this.toastService.presentToastError("La transaccion ha fallido");
      }
    }
  }

  setDataphoneData() {
    this.max_ammount_dataphone = Math.round(this.data_invoice.body.data.total);
    this.formControlTotalValue.setValue(Math.round(this.data_invoice.body.data.total));
    this.relative_taxes_dataphone_payment = (Math.round(this.data_invoice.body.data.imp));
  }

  listenDataphoneValue() {
    this.formControlTotalValue.valueChanges
      .pipe(
        debounceTime(300) // espera 300ms después de dejar de escribir
      )
      .subscribe(valor => {
        this.updateTaxes(this.max_ammount_dataphone, valor);
      });
  }

  updateTaxes(first_total: number, new_total: number) {
    if (first_total <= 0) {
      console.warn('El total anterior debe ser mayor que cero.');
      return;
    }

    if (new_total <= 0) {
      console.warn('El nuevo total debe ser mayor que cero.');
      return;
    }
    // SOLAMENTE calculamos el porcentaje original la primera vez
    if (this.original_tax_percent === null) {
      this.original_tax_percent = this.relative_taxes_dataphone_payment / first_total;
      console.log('✅ Porcentaje de impuesto inicial guardado:', (this.original_tax_percent * 100).toFixed(2) + '%');
    }

    // Ya no se vuelve a recalcular: aplicamos el porcentaje inicial al nuevo total
    this.relative_taxes_dataphone_payment = Math.round(new_total * this.original_tax_percent);

  }

  /**
   * Método opcional para resetear el porcentaje si quieres
   */
  resetOriginalTaxPercent() {
    this.original_tax_percent = null;
  }

  async print(data_json) {
    console.log("print");
    if (this.is_integrate_print && this.require_print) {
      console.log("si llego a impresora");
      try {
        if (data_json && data_json.QR) {
          data_json.url = `https://www.fullsuit.co/app/#/f/${data_json.QR}`;
        }
        await this.dataphoneService.startPrint(data_json);
      } catch (error) {
        console.error('Error al imprimir el recibo:', error);
        this.toastService.presentToastError('No se pudo imprimir el recibo. Verifique la impresora del dispositivo.');
      }
    }
  }

}

export interface TypeUser {
  valueBackground: string;
  name: string;
}

export interface RecordCopyInvoice {
  _idInvoicePrinted: string;
  numberCopies: number;
}


