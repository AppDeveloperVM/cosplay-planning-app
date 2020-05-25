import { Component, OnInit, Input } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { Cosplay } from '../../cosplay.model';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CosplayGroupService } from '../cosplay-group.service';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';
import { NgForm } from '@angular/forms';
import { CosplayGroupRequestService } from './cosplay-group-request.service';

@Component({
  selector: 'app-cosplay-group-request',
  templateUrl: './cosplay-group-request.component.html',
  styleUrls: ['./cosplay-group-request.component.scss'],
})
export class CosplayGroupRequestComponent implements OnInit {
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() requestedCharacter: Cosplay;
  // loadedCosplayRequest: Cosplay[] = [];
  loadedCosplayRequest: string;

  cosplayGroup: CosplayGroup;
  cosplay: Cosplay;
  newCosplayGroup: CosplayGroup;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplayGroupService: CosplayGroupService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,

    private cosplayGroupRequestService: CosplayGroupRequestService
  ) { }

  ngOnInit() {
    // this.loadedCosplayRequest = this.cosplayGroupRequestService.cosplaygrouprequests;
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
        selectedCosplayGroup: this.selectedCosplayGroup,
        requestedCharacter: this.loadedCosplayRequest // ?
      },
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

}
