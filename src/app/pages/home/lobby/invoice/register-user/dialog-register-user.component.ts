import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Island} from '../../../../../models/island/Island';
import {FormControl, Validators} from '@angular/forms';
import {OperatorService} from '../../../../../services/operator/operator.service';
import {Router} from '@angular/router';
import {User} from '../../../../../models/user/user';
import {RegisterInvoice} from '../../../../../models/user/register-invoice/RegisterInvoice';
import {Global} from '../../../../../models/global/global';
import {OrganizationInfo} from '../../../../../models/organization/organization';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Company} from '../../../../../models/company/company';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../../../services/loading/loading.service';
import {ToastService} from '../../../../../services/toast/toast.service';
import {Util} from '../../../../../util/Util';
import {Ubication} from '../../../../../models/ubication/ubication';

@Component({
  selector: 'app-register-user',
  templateUrl: './dialog-register-user.component.html',
  styleUrls: ['./dialog-register-user.component.scss']
})
export class DialogRegisterUserComponent implements OnInit {
  public preload = false;
  public readonly typeUser: TypeUser = {
    name: 'Usuario',
    valueBackground: 'client',
  };
  public readonly typeCompany: TypeUser = {
    name: 'Empresa',
    valueBackground: 'company',
  };
  public listTypeUser: TypeUser[] = [
    this.typeUser,
    this.typeCompany,
  ];
  // formControlTypeUser: FormControl = new FormControl('', [Validators.required]);
  formControlName: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
  );
  formControlNIT: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[0-9]+')]
  );
  formControlEmail: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
  );
  formControlEmailOtherDomainText: FormControl = new FormControl('',
    [Validators.required, Validators.maxLength(30)]
  );
  formControlEmailDomain: FormControl = new FormControl('',
    [Validators.required]
  );
  formControlPhoneNumber: FormControl = new FormControl('',
    [Validators.required, Validators.minLength(5), Validators.maxLength(20)]
  );
  // formControlDigit: FormControl = new FormControl('',
  //   [Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]+')]
  // );
  public errorMessage: string;
  @Output() changeToInvoice: EventEmitter<any> = new EventEmitter();
  usersOrCompanyList: User[] | Company[] = [];
  public isSelectUser: boolean;
  public userSelected: User | Company | any;
  public listEmailDomains: string[] = Util.listEmailDomains;
  public otherEmailDomain = true;
  public isLegalPerson = false;
  public formControlCity: FormControl = new FormControl('', [ Validators.required]);
  public lastCitySelected: Ubication;
  public cityList: Ubication[];

  constructor(private operatorService: OperatorService,
              private router: Router,
              public modalController: ModalController,
              private loadingService: LoadingService,
              private toastService: ToastService,
  ) {
    this.formControlEmailDomain.setValue(this.listEmailDomains[0]);
    // this.formControlTypeUser.setValue(this.typeCompany.valueBackground);
    // this.getInfoOrganization();
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
    }, 100);
  }

  private getInfoOrganization() {
       this.errorMessage = undefined;
       this.operatorService.getInfoOrganization().subscribe(
         (value: any) => {
            const organizationInfo: OrganizationInfo = value.body;
            console.log(organizationInfo);
            this.setDataOrg(organizationInfo.organization.email, organizationInfo.department, organizationInfo.organization.phone);
         },
         error => {
           this.preload = false;
           this.errorMessage = 'Error obteniendo los datos, por favor intente nuevamente';
         }
       );
     
  }

  setDataOrg(email, city, phone){
    this.formControlPhoneNumber.setValue(phone);
    this.lastCitySelected = city;
    this.formControlCity.setValue(city.name);
    let email_split = email.split("@");
    this.formControlEmail.setValue(email_split[0]);
    this.formControlEmailOtherDomainText.setValue(email_split[1]);

  }

  ngOnInit(): void {
    this.getInfoOrganization();
  }

  buildBody(): RegisterInvoice {
    // const typeUser = this.formControlTypeUser.value;
    // if (typeUser === this.typeUser.valueBackground) {
    //   return {
    //     name: this.formControlName.value,
    //     document: this.formControlNIT.value.toString(),
    //     email: this.formControlEmail.value.toString().toLowerCase(),
    //     phones: [this.formControlPhoneNumber.value],
    //     type: this.formControlTypeUser.value,
    //     plaque: this.operatorService.readLocalHostPlaque()
    //   };
    // } else if (typeUser === this.typeCompany.valueBackground) {
    const checkDigit = Util.getDigitVerification(this.formControlNIT.value);
    let email = this.formControlEmail.value.toString().toLowerCase();
    if (this.otherEmailDomain) {
      const emailDomain = this.formControlEmailOtherDomainText.value?.toString()?.toLowerCase();
      email += '@' + emailDomain;
    } else {
      email += '@' + this.formControlEmailDomain.value?.toString()?.toLowerCase();
    }
    const body = {
      name: this.formControlName.value,
      nit: this.formControlNIT.value,
      emails: [email],
      phones: [this.formControlPhoneNumber.value],
      type: this.typeCompany.valueBackground,
      ubication: this.lastCitySelected._id,
      plaque: this.operatorService.readLocalHostPlaque(),
      digit_check: checkDigit + ''
    };
    return body;
    // }
  }

  register() {
    if (!this.formControlEmail.value) {
      this.formControlEmail.markAsTouched();
      return;
    }
    let email = this.formControlEmail.value.toString();
    email = Util.replaceAllStrings(email, ' ', '');
    email = Util.replaceAllStrings(email, '@', '');
    this.formControlEmail.setValue(email);
    if (this.otherEmailDomain) {
      if (!this.formControlEmailOtherDomainText.value) {
        this.formControlEmailOtherDomainText.markAsTouched();
        return;
      }
      let emailDomain = this.formControlEmailOtherDomainText.value?.toString();
      emailDomain = Util.replaceAllStrings(emailDomain, ' ', '');
      emailDomain = Util.replaceAllStrings(emailDomain, '@', '');
      this.formControlEmailOtherDomainText.setValue(emailDomain);
    }
    if (
      this.formControlName.valid &&
      this.formControlNIT.valid &&
      this.formControlEmail.valid &&
      this.formControlPhoneNumber.valid &&
      this.lastCitySelected &&
      (!this.otherEmailDomain || this.otherEmailDomain && this.formControlEmailOtherDomainText.valid)
    ) {
      this.operatorService.deleteUserRegister();
      this.preload = true;
      this.startLoading();
      this.errorMessage = undefined;
      this.operatorService.registerUser(this.buildBody()).subscribe(
        (value: any) => {
          this.changeToInvoice.emit();
          // this.listTypeUser = value;

          this.operatorService.fullSuitMigrateCustomers().subscribe(
            value => {},
          );

          setTimeout(() => {
            this.preload = false;
            this.modalController.dismiss(value.body.user);
            this.toastService.presentToastOk('Empresa Creada');
          }, 300);
         
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400 && (error?.error?.body?.errors?.email || error.error.body?.message?.toLowerCase().includes('email'))) {
            this.toastService.presentToastError('El email ya se escuentra registrado, debe ingresar otro.');
          } else if (error.status === 400 && (error?.error?.body?.errors?.nit || error.error.body?.message?.toLowerCase().includes('nit'))) {
            this.toastService.presentToastError('El nit ya se escuentra registrado, debe ingresar otro.');
          } else {
            this.toastService.presentToastError('Error registrando el usuario, por favor intente nuevamente');
          }
          this.preload = false;
        }
      );
    } else {
      this.formControlName.markAsTouched();
      this.formControlNIT.markAsTouched();
      this.formControlEmail.markAsTouched();
      this.formControlPhoneNumber.markAsTouched();
      this.formControlEmailOtherDomainText.markAsTouched();
      this.formControlCity.markAsTouched();
    }
  }

  /**
   * Mensaje de error nombre
   */
  getErrorMessageName() {
    return this.formControlName.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlName.hasError('minlength')
        ? 'Longitud mínima de 3 cacteres'
        : this.formControlName.hasError('maxlength')
          ? 'Longitud máxima de 30 cacteres'
          : '';
  }

  /**
   * Mensaje de error NIT
   */
  getErrorMessageNit() {
    return this.formControlNIT.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlNIT.hasError('minlength')
        ? 'Longitud mínima de 5 cacteres'
        : this.formControlNIT.hasError('maxlength')
          ? 'Longitud máxima de 15 cacteres'
          : this.formControlNIT.hasError('pattern')
            ? 'Solo se permiten caracteres numéricos'
            : '';
  }

  /**
   * Mensaje de error email
   */
  getErrorMessageEmail() {
    return this.formControlEmail.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlEmail.hasError('minlength')
        ? 'Longitud mínima de 3 cacteres'
        : this.formControlEmail.hasError('maxlength')
          ? 'Longitud máxima de 40 cacteres'
          : '';
  }

  /**
   * Mensaje de error dominio de email
   */
  getErrorMessageEmailOtherDomainText() {
    return this.formControlEmailOtherDomainText.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlEmailOtherDomainText.hasError('maxlength')
        ? 'Longitud máxima de 15 cacteres'
        : '';
  }

  /**
   * Mensaje de error Número telefónico
   */
  getErrorMessagePhoneNumber() {
    return this.formControlPhoneNumber.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlPhoneNumber.hasError('minlength')
        ? 'Longitud mínima de 5 cacteres'
        : this.formControlPhoneNumber.hasError('maxlength')
          ? 'Longitud máxima de 20 cacteres'
          : '';
  }

  back() {
    this.changeToInvoice.emit();
  }

  // getErrorDigit() {
  //   return this.formControlDigit.hasError('required')
  //     ? 'Este campo es obligatorio'
  //     : this.formControlDigit.hasError('pattern')
  //       ? 'Solo se permiten caracteres numéricos'
  //       : this.formControlDigit.hasError('minlength') || this.formControlDigit.hasError('maxlength')
  //         ? 'Diebe ingresar 1 único dígito'
  //         : '';
  // }

  // changeUsersAutocomplete() {
  //   if (this.isSelectUser) {
  //     this.isSelectUser = false;
  //     return;
  //   }
  //   this.userSelected = undefined;
  //   this.formControlNIT.markAsTouched();
  //   if (this.formControlNIT.valid) {
  //     const type = this.typeCompany.valueBackground;
  //     const searchUserOrCompany = {
  //       type,
  //       identification: this.formControlNIT.value,
  //     };
  //     this.operatorService.searchUserOrCompany(searchUserOrCompany, 0, 5).subscribe(
  //       (value: HttpResponse<any>) => {
  //         if (this.typeCompany.valueBackground === type) {
  //           this.usersOrCompanyList = value.body.companies;
  //         } else {
  //           this.usersOrCompanyList = value.body.users;
  //         }
  //         console.log(value);
  //       }
  //     );
  //   } else {
  //     this.usersOrCompanyList = [];
  //   }
  // }

  changeCityAutocomplete() {
    if (this.lastCitySelected?.name !== this.formControlCity.value) {
      this.lastCitySelected = undefined;
    }
    const bodySearch = {
      value: this.formControlCity.value,
    };
    this.operatorService.searchCity(bodySearch, 0, 5).subscribe(
      value => {
        this.cityList = value.body.body.cities;
      }
    );
  }

  onSelectOption(option: Ubication) {
    console.log(option);
    this.lastCitySelected = option;
  }

  /**
   * Mensaje de error ciudad
   */
  getErrorMessageCity() {
    return this.formControlCity.hasError('required')
      ? 'Este campo es obligatorio.'
      : '';
  }

  changeSelectedType() {
    this.userSelected = undefined;
    this.usersOrCompanyList = [];
  }

  // onSelectOption(option: User | Company) {
  //   this.userSelected = option;
  //   this.isSelectUser = true;
  //   console.log(this.userSelected);
  // }

  saveAutocompleteUser() {
    this.operatorService.saveTypeUser(this.typeCompany.valueBackground);
    this.operatorService.saveUserOrCompany(this.userSelected);
    this.changeToInvoice.emit();
  }

  changeCheckBoxDomain(event) {
    this.otherEmailDomain = !this.otherEmailDomain;
  }

  changeCheckLegalPerson(event) {
    this.isLegalPerson = !this.isLegalPerson;
  }
}

export interface TypeUser {
  valueBackground: string;
  name: string;
}
