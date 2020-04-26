import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateCosplayGroupComponent } from '../../create-cosplay-group/create-cosplay-group.component';

@Component({
  selector: 'app-cosplay-group-details',
  templateUrl: './cosplay-group-details.page.html',
  styleUrls: ['./cosplay-group-details.page.scss'],
})
export class CosplayGroupDetailsPage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  onSaveCosplayGroup() {
    this.modalCtrl
    .create({
      component: CreateCosplayGroupComponent,
      componentProps: { selectedCosplayGroup: this.cosplayGroup }
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm'){
        console.log('Saved!');
      }
    });
  }

}
