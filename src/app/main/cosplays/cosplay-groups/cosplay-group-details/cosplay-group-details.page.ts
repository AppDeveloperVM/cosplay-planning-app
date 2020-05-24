import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../cosplay-group.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Cosplay } from '../../cosplay.model';
import { CosplayGroupRequestComponent } from '../cosplay-group-request/cosplay-group-request.component';



@Component({
  selector: 'app-cosplay-group-details',
  templateUrl: './cosplay-group-details.page.html',
  styleUrls: ['./cosplay-group-details.page.scss'],
})
export class CosplayGroupDetailsPage implements OnInit {
  cosplayGroup: CosplayGroup;
  cosplay: Cosplay;
  newCosplayGroup: CosplayGroup;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplayGroupService: CosplayGroupService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayGroupId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/cosplay-groups');
        return;
      }
      this.cosplayGroup = this.cosplayGroupService.getCosplayGroup(paramMap.get('cosplayGroupId'));
      // this.cosplay.characterName = this.cosplay.characterName;
      console.log('Cosplaygroup id: ' + this.cosplayGroup.id);
    });
  }

  onRequestCosplayGroup() {
    this.modalCtrl
    .create(
      {
      component: CosplayGroupRequestComponent,
      componentProps: { selectedCosplayGroup: this.cosplayGroup },
      cssClass: 'modal-fullscreen'
      }
    ).then(modalEl => {
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

  onSubmit(form: NgForm) {
    if (!form.valid) { // if is false
      return;
    }
    const characterName = form.value.character;
    // this.newCosplay = this.cosplayService.setCosplayRequest();

    console.log(characterName);
  }

}
