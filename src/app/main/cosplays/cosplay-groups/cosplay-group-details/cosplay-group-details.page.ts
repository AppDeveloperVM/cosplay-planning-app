import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../cosplay-group.service';
import { ActivatedRoute } from '@angular/router';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';

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
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayGroupId')) {
        this.navCtrl.navigateBack('/main/tabs(cosplays/cosplay-groups');
        return;
      }
      this.cosplayGroup = this.cosplayGroupService.getCosplayGroup(paramMap.get('CosplayGroupId'));
    });
  }

  onSaveCosplayGroup() {
    this.modalCtrl
    .create({
      component: CosplayGroupSendRequestComponent,
      componentProps: { selectedCosplayGroup: this.cosplayGroup }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('Request Send!');
      }
    });
  }

}
