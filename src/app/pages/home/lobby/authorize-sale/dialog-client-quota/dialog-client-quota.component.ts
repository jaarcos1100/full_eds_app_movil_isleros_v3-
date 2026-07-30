import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Company } from '../../../../../models/company/company';
import { RestrictionsService } from '../../../../../services/restrictions/restrictions.service';

@Component({
  selector: 'app-dialog-client-quota',
  templateUrl: './dialog-client-quota.component.html',
  styleUrls: ['./dialog-client-quota.component.scss']
})
export class DialogClientQuotaComponent implements OnInit {
  public company: Company = this.navParams.get('company');
  public preload = true;
  public hasCupo = false;

  constructor(
    public modalController: ModalController,
    private navParams: NavParams,
    private restrictionsService: RestrictionsService,
  ) {
  }

  ngOnInit(): void {
    this.restrictionsService.getRestrictions(this.company._id).subscribe(
      (res: any) => {
        const restrictions = res?.body?.restrictions || [];
        this.hasCupo = restrictions.length > 0 && restrictions[0].type_sold === 'cupo';
        this.preload = false;
      },
      () => {
        this.hasCupo = false;
        this.preload = false;
      }
    );
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
  }
}
