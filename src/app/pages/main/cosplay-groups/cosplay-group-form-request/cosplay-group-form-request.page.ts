import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { CosplayGroupService } from '../../../../services/cosplay-group.service';
import { CosplayGroup } from '../cosplay-group.model';
import { NgForm } from '@angular/forms';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cosplay-group-form-request',
  templateUrl: './cosplay-group-form-request.page.html',
  styleUrls: ['./cosplay-group-form-request.page.scss'],
})
export class CosplayGroupFormRequestPage implements OnInit, OnDestroy {
  subscription: Subscription;
  cosplayGroup = null;
  cosplayGroupId;
  private cosplaygroupSub: Subscription;
  loadedCosplayRequest: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router,
    private cosplayGroupService: CosplayGroupService,
    private loadingCtrl: LoadingController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state == undefined) { this.router.navigate(['main/tabs/cosplay-groups']); }
    this.cosplayGroup = navigation?.extras?.state.value;

    console.log("location: "+this.cosplayGroup.location);
  }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    if (!form.valid) { // if is false
      return;
    }
    const characterName = form.value.character;
    // this.newCosplay = this.cosplayService.setCosplayRequest();

    this.loadedCosplayRequest = characterName;
    console.log(this.loadedCosplayRequest);

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
      if (resultData.role === 'confirm') {

        this.loadingCtrl.create({message: 'Sending request..'})
        .then(
          loadingEl => {
            loadingEl.present();
            const data = resultData.data; // get possible extra data from here

            loadingEl.dismiss();
            
            this.router.navigateByUrl('/main/tabs/cosplay-groups');
          }
        );
      }

    });
  }

  ngOnDestroy() {
    if (this.cosplaygroupSub) {
      this.cosplaygroupSub.unsubscribe();
    }
  }

}
