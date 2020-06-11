import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CosplaysService } from '../../cosplays.service';
import { NavController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-cosplay',
  templateUrl: './edit-cosplay.page.html',
  styleUrls: ['./edit-cosplay.page.scss'],
})
export class EditCosplayPage implements OnInit {
  cosplay: Cosplay;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private cosplayService: CosplaysService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayId')) {
        this.navCtrl.navigateBack('main/tabs/cosplays/my-cosplays');
        return;
      }
      this.cosplay = this.cosplayService.getCosplay(paramMap.get('cosplayId'));
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
    console.log(this.form);
  }

}
