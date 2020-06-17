import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CosplaysService } from '../../cosplays.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-cosplay',
  templateUrl: './edit-cosplay.page.html',
  styleUrls: ['./edit-cosplay.page.scss'],
})
export class EditCosplayPage implements OnInit, OnDestroy {
  cosplay: Cosplay;
  cosplaySub: Subscription;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private cosplayService: CosplaysService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayId')) {
        this.navCtrl.navigateBack('main/tabs/cosplays/my-cosplays');
        return;
      }
      this.cosplaySub = this.cosplayService.getCosplay(paramMap.get('cosplayId')).subscribe(cosplay => {
        this.cosplay = cosplay;
      });

      this.form = new FormGroup({
        characterName: new FormControl(this.cosplay.characterName , {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        series: new FormControl(this.cosplay.series, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)]
        }),
        description: new FormControl(this.cosplay.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)]
        })
      });
    });
  }

  onUpdateCosplay() {
    if (!this.form.valid) {
      return;
    }
    console.log('cosplay id:' + this.cosplay.id + ', cosplay char:' + this.cosplay.characterName);

    this.loadingCtrl.create(
      { message: 'Updating Cosplay...' }
    ).then(loadingEl => {
      loadingEl.present();
      this.cosplayService.updateCosplay(
        this.cosplay.id,
        this.cosplay.characterName,
        this.cosplay.description,
        this.cosplay.imageUrl,
        this.cosplay.series,
        this.cosplay.funds,
        this.cosplay.percentComplete,
        this.cosplay.status,
        this.cosplay.userId
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/tabs/cosplays/my-cosplays']);
      });
    });

  }

  ngOnDestroy() {
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

}
