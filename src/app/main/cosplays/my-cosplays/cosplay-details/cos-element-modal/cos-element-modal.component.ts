import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

//import { ReactiveFormsModule, ... } from '@angular/forms';

@Component({
  selector: 'app-cos-element-modal',
  templateUrl: './cos-element-modal.component.html',
  styleUrls: ['./cos-element-modal.component.scss'],
})
export class CosElementModalComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
