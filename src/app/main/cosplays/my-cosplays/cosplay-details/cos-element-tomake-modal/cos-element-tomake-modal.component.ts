import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cos-element-tomake-modal',
  templateUrl: './cos-element-tomake-modal.component.html',
  styleUrls: ['./cos-element-tomake-modal.component.scss'],
})
export class CosElementTomakeModalComponent implements OnInit {

  dateValue = '';
  dateValue2 = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
