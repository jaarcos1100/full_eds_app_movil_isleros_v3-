import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dialog-register-sale',
  templateUrl: './dialog-help.component.html',
  styleUrls: ['./dialog-help.component.scss']
})
export class DialogHelpComponent implements OnInit {

  constructor(
    public modalController: ModalController,
    public router: Router,
  ) {}

  ngOnInit(): void {
  }
}
