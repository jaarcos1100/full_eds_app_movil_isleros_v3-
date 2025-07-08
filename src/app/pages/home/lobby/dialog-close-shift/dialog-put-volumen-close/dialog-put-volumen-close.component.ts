import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OperatorService } from '../../../../../services/operator/operator.service';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { LoadingService } from '../../../../../services/loading/loading.service';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-dialog-put-volumen-close',
  templateUrl: './dialog-put-volumen-close.component.html',
  styleUrls: ['./dialog-put-volumen-close.component.css']
})
export class DialogPutVolumenCloseComponent {

  formVolume: FormControl = new FormControl('',
    [Validators.required]
  );

  // formControlDigit: FormControl = new FormControl('',
  //   [Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]+')]
  // );
  public errorMessage: string;
  @Output() changeToInvoice: EventEmitter<any> = new EventEmitter();

  public data: any;



  constructor(private operatorService: OperatorService,
    private router: Router,
    public modalController: ModalController,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private navParams: NavParams
  ) {

    // this.formControlTypeUser.setValue(this.typeCompany.valueBackground);
    // this.getInfoOrganization();
    this.data = this.navParams.get('volume');
    this.formVolume.setValue(this.data);
  }



  ngOnInit(): void {
  }

  saveVolumen() {
    this.modalController.dismiss(this.formVolume.value);
  }

  getErrorMessageNumber() {
    return this.formVolume.hasError('required')
      ? 'Este campo es obligatorio'
      : '';
  }


}





