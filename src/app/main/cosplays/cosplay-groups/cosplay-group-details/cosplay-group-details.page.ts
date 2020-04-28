import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CreateCosplayGroupComponent } from '../../create-cosplay-group/create-cosplay-group.component';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../cosplay-group.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cosplay-group-details',
  templateUrl: './cosplay-group-details.page.html',
  styleUrls: ['./cosplay-group-details.page.scss'],
})
export class CosplayGroupDetailsPage implements OnInit {
  cosplayGroup: CosplayGroup;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplayGroupService: CosplayGroupService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  onSaveCosplayGroup() {
    this.modalCtrl
    .create({
      component: CreateCosplayGroupComponent,
      componentProps: { selectedCosplayGroup: this.cosplayGroup }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('Saved!');
      }
    });
  }

}
