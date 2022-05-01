import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

//import { ReactiveFormsModule, ... } from '@angular/forms';

@Component({
  selector: 'app-cos-element-details-modal',
  templateUrl: './cos-element-details-modal.component.html',
  styleUrls: ['./cos-element-details-modal.component.scss'],
})
export class CosElementDetailsModalComponent implements OnInit {

  @Input() title = 'Detalles';
  @Input() name = 'New Item';
  @Input() store = 'Amazon';
  @Input() cost = '0.00€';
  @Input() comment = 'Notes...';
  
  constructor(
    private router: Router,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
