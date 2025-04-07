import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatorPage } from './operator-page.component';
import {ChooseIslandComponent} from './choose-component/choose-island.component';
import {SignInOperatorComponent} from './sign-in-operator/sign-in-operator.component';
import {SummaryComponent} from './summary/summary.component';
import {LobbyHomeComponent} from './lobby/lobby-home/lobby-home.component';
import {InfoSaleComponent} from './lobby/info-sale/info-sale.component';
import {GuardLoginOperator} from '../../guards/guard-login-operator/guard-login-operator-guard.service';

const routes: Routes = [
  { path: '', component: OperatorPage,
    children: [
      { path: '', component: ChooseIslandComponent },
      // { path: 'close-shift', component: CloseShiftOperatorComponent },
      { path: 'sign-in', component: SignInOperatorComponent },
      { path: 'summary', component: SummaryComponent, canActivate: [GuardLoginOperator] },
      {
        path: 'lobby',
        loadChildren: () => import('./lobby/lobby.module').then(m => m.LobbyPageModule)
      },
      // {
      //   path: 'lobby-home',
      //   loadChildren: () => import('./lobby-home-a/lobby-home-a-routing.module').then(module => module.LobbyAPageRoutingModule)
      // },
      // { path: 'lobby-home', component: LobbyComponent, }, // canActivate: [GuardLoginOperator] },
      // { path: 'info-sale', component: InfoSaleComponent , } // canActivate: [GuardLoginOperator] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorPageRoutingModule {}
