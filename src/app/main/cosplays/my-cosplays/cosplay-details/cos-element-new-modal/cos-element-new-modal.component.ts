import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CosElementTobuyModalComponent } from '../cos-element-tobuy-modal/cos-element-tobuy-modal.component';
import { CosElementTomakeModalComponent } from '../cos-element-tomake-modal/cos-element-tomake-modal.component';


//import { ReactiveFormsModule, ... } from '@angular/forms';

@Component({
  selector: 'app-cos-element-new-modal',
  templateUrl: './cos-element-new-modal.component.html',
  styleUrls: ['./cos-element-new-modal.component.scss'],
})
export class CosElementNewModalComponent implements OnInit {

  @Input() selectedCosplay;
  
  constructor(
    private router: Router,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {

  }

  goToBuyModal(){
    this.onClose();

    this.modalCtrl.create({
      component: CosElementTobuyModalComponent, 
      cssClass: 'custom-modal',
      componentProps: {
      }}).then(modalEl => {
        modalEl.present();
      });

  }

  goToMakeModal(){
    this.onClose();

    this.modalCtrl.create({
      component: CosElementTomakeModalComponent, 
      cssClass: 'custom-modal',
      componentProps: {
        selectedCosplay: this.selectedCosplay
      }}).then(modalEl => {
        modalEl.present();
      });
  }

  onClose() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
