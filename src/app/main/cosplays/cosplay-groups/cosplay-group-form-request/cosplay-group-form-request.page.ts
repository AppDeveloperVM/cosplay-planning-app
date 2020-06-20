import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { CosplayGroupService } from '../cosplay-group.service';
import { CosplayGroup } from '../cosplay-group.model';
import { NgForm } from '@angular/forms';
import { CosplayGroupSendRequestComponent } from '../cosplay-group-send-request/cosplay-group-send-request.component';
import { Cosplay } from '../../cosplay.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cosplay-group-form-request',
  templateUrl: './cosplay-group-form-request.page.html',
  styleUrls: ['./cosplay-group-form-request.page.scss'],
})
export class CosplayGroupFormRequestPage implements OnInit, OnDestroy {
  subscription: Subscription;
  cosplayGroup: CosplayGroup;
  private cosplaygroupSub: Subscription;
  loadedCosplayRequest: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router,
    private cosplayGroupService: CosplayGroupService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayGroupId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/cosplay-groups');
        return;
      }
      this.cosplaygroupSub = this.cosplayGroupService
        .getCosplayGroup(paramMap.get('cosplayGroupId'))
        .subscribe(cosplayGroup => {
        this.cosplayGroup = cosplayGroup;
      });
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
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({message: 'Sending request..'})
        .then(
          loadingEl => {
            loadingEl.present();
            const data = resultData.data; // get possible extra data from here

            /* Aquí se crearía o enviaría la solicitud de personaje para la GRUPAL
            this.cosplayGroupService.addCosplayGroup(
              this.cosplayGroup.id,
              this.cosplayGroup.title,
              this.cosplayGroup.series,
              this.cosplayGroup.place,
              this.cosplayGroup.availableFrom,
              this.cosplayGroup.availableTo
            )
            .subscribe(() => {
              loadingEl.dismiss();
            });
            */

            this.router.navigateByUrl('/main/tabs/cosplays/cosplay-groups');
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
