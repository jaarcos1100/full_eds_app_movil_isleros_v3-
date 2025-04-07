import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LobbyPage } from './lobby-page.component';
import {LobbyHomeComponent} from './lobby-home/lobby-home.component';
import {InfoSaleComponent} from './info-sale/info-sale.component';
import {DialogBasketPlaqueComponent} from './basket-plaque/dialog-basket-plaque.component';
import {BasketSaleComponent} from './basket-sale/basket-sale.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {GuardLoginOperator} from '../../../guards/guard-login-operator/guard-login-operator-guard.service';
import {TankersComponent} from './tankers/tankers.component';
import {HistoryTanksComponent} from '../../custom/history-tanks/history-tanks.component';
import {SummaryComponent} from '../summary/summary.component';

const routes: Routes = [
  {path: '', component: LobbyPage,
    children: [
      { path: '', component: LobbyHomeComponent, canActivate: [GuardLoginOperator] },
      { path: 'tankers', component: TankersComponent, canActivate: [GuardLoginOperator] },
      { path: 'info-sale', component: InfoSaleComponent, canActivate: [GuardLoginOperator] },
      { path: 'basket-plaque', component: DialogBasketPlaqueComponent, canActivate: [GuardLoginOperator] },
      { path: 'pos', component: BasketSaleComponent, canActivate: [GuardLoginOperator] },
      { path: 'history-sales', component: HistoryTanksComponent, canActivate: [GuardLoginOperator] },
      { path: 'invoice', component: InvoiceComponent, canActivate: [GuardLoginOperator] },
      { path: 'summary-current/:isCurrent', component: SummaryComponent, canActivate: [GuardLoginOperator] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbyPageRoutingModule {}
