import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {OperatorPage} from './operator-page.component';
import {OperatorPageRoutingModule} from './operator-routing.module';
import {ChooseIslandComponent} from './choose-component/choose-island.component';
import {SignInOperatorComponent} from './sign-in-operator/sign-in-operator.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SummaryComponent} from './summary/summary.component';
import {DialogSettingsHostComponent} from './choose-component/dialog-settings-host/dialog-settings-host.component';
import {DialogHistoricalSalesComponent} from './lobby/dialog-historical-sales/dialog-historical-sales.component';
import {MatSelectModule} from '@angular/material/select';
import {HistoryTanksComponent} from '../custom/history-tanks/history-tanks.component';
import {LobbyPageModule} from './lobby/lobby.module';
import {DialogHelpComponent} from './choose-component/dialog-help/dialog-help.component';
import {PopoverAboutOfComponent} from './choose-component/popover-about-of/popover-about-of.component';
import {DialogChangeInvoicePlaqueComponent} from './lobby/info-sale/dialog-change-invoice-plaque/dialog-change-invoice-plaque.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatorPageRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    LobbyPageModule
  ],
  declarations: [
    OperatorPage,
    ChooseIslandComponent,
    SignInOperatorComponent,
    SummaryComponent,
    DialogSettingsHostComponent,
    DialogHelpComponent,
    DialogHistoricalSalesComponent,
    HistoryTanksComponent,
    PopoverAboutOfComponent,
    DialogChangeInvoicePlaqueComponent
  ]
})
export class OperatorPageModule {}
