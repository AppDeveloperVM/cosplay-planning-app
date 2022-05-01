import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cos-task-modal',
  templateUrl: './cos-task-modal.component.html',
  styleUrls: ['./cos-task-modal.component.scss'],
})
export class CosTaskModalComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
