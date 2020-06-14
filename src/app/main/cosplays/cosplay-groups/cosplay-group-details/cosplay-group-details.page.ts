import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../cosplay-group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Cosplay } from '../../cosplay.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cosplay-group-details',
  templateUrl: './cosplay-group-details.page.html',
  styleUrls: ['./cosplay-group-details.page.scss'],
})
export class CosplayGroupDetailsPage implements OnInit, OnDestroy {
  cosplayGroup: CosplayGroup;
  private cosplayGroupSub: Subscription;
  cosplay: Cosplay;
  newCosplayGroup: CosplayGroup;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplayGroupService: CosplayGroupService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayGroupId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/cosplay-groups');
        return;
      }
      this.cosplayGroupSub = this.cosplayGroupService.getCosplayGroup(paramMap.get('cosplayGroupId')).subscribe(cosplayGroup => {
        this.cosplayGroup = cosplayGroup;
      });

      console.log('Cosplaygroup id: ' + this.cosplayGroup.id);
    });
  }


  onRequestCosplayGroup() {

  }

  onSubmit(form: NgForm) {
    if (!form.valid) { // if is false
      return;
    }
    const characterName = form.value.character;
    // this.newCosplay = this.cosplayService.setCosplayRequest();

    console.log(characterName);
  }

  ngOnDestroy() {
    if (this.cosplayGroupSub) {
      this.cosplayGroupSub.unsubscribe();
    }
  }

}
