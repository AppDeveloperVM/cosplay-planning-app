import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { CosplayGroupService } from '../cosplay-group.service';
import { CosplayGroup } from '../cosplay-group.model';
import { NgForm } from '@angular/forms';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';
import { Cosplay } from '../../cosplay.model';

@Component({
  selector: 'app-cosplay-group-form-request',
  templateUrl: './cosplay-group-form-request.page.html',
  styleUrls: ['./cosplay-group-form-request.page.scss'],
})
export class CosplayGroupFormRequestPage implements OnInit {
  cosplayGroup: CosplayGroup;
  loadedCosplayRequest: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router,
    private cosplayGroupService: CosplayGroupService
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

  onSubmit(form: NgForm) {
    if (!form.valid) { // if is false
      return;
    }
    const characterName = form.value.character;
    // this.newCosplay = this.cosplayService.setCosplayRequest();

    this.loadedCosplayRequest = characterName;
    console.log(this.loadedCosplayRequest);
     // this.loadedCosplayRequest.push(characterName);

    this.onRequestCosplayGroup();

  }

  onRequestCosplayGroup() {
    this.modalCtrl
    .create(
      {
      component: CosplayGroupSendRequestComponent,
      componentProps: {
        selectedCosplayGroup: this.cosplayGroup,
        requestedCharacter: this.loadedCosplayRequest // ?
      }
      }
    ).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('Request Send!');
        this.router.navigateByUrl('/main/tabs/cosplays/cosplay-groups');
      }
      
    });
  }

}
