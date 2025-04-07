import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LobbyPageRoutingModule } from './lobby-routing.module';

import { LobbyPage } from './lobby-page.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatInputModule} from '@angular/material/input';
import {LobbyHomeComponent} from './lobby-home/lobby-home.component';
import {InfoSaleComponent} from './info-sale/info-sale.component';
import {DialogBasketPlaqueComponent} from './basket-plaque/dialog-basket-plaque.component';
import {BasketSaleComponent} from './basket-sale/basket-sale.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {DialogRegisterUserComponent} from './invoice/register-user/dialog-register-user.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {DialogAuthorizeSaleComponent} from './authorize-sale/dialog-authorize-sale.component';
import {DialogCloseShiftComponent} from './dialog-close-shift/dialog-close-shift.component';
import {MatDividerModule} from '@angular/material/divider';
import {DialogQuantityProductComponent} from './basket-sale/quantity-product/dialog-quantity-product.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ToolbarCustomComponent} from '../../custom/toolbar-custom/toolbar-custom.component';
import {LongPressDirective} from '../../../directives/long-press.directive';
import {TankersComponent} from './tankers/tankers.component';
import {ReplaceTextPipe} from '../../../pipes/replace-text/replace-text.pipe';
import { DialogViewRemainingSalesComponent } from './dialog-view-remaining-sales/dialog-view-remaining-sales';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LobbyPageRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatSlideToggleModule
  ],
  exports: [
    ToolbarCustomComponent
  ],
  declarations: [
    LobbyPage,
    LobbyHomeComponent,
    InfoSaleComponent,
    DialogBasketPlaqueComponent,
    BasketSaleComponent,
    InvoiceComponent,
    DialogRegisterUserComponent,
    DialogCloseShiftComponent,
    DialogAuthorizeSaleComponent,
    DialogQuantityProductComponent,
    ToolbarCustomComponent,
    LongPressDirective,
    TankersComponent,
    ReplaceTextPipe,
    DialogViewRemainingSalesComponent,
  ]
})
export class LobbyPageModule {}
