import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { Observable, Subscription } from 'rxjs';
import { NavController, ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CosplayGroupService } from '../../../services/cosplay-group.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../models/location.model';
import { UploadImageService } from 'src/app/services/upload-img.service';


@Component({
  selector: 'app-edit-cosplay-group',
  templateUrl: './edit-cosplay-group.page.html',
  styleUrls: ['./edit-cosplay-group.page.scss'],
})
export class EditCosplayGroupPage implements OnInit, OnDestroy {
  cosplayGroup: CosplayGroup;
  cosplayGroupId: string;
  isLoading = true;
  private cosplayGroupSub: Subscription;
  form: FormGroup;
  actualImage = "";
  actualMapImage = "";
  selectedLocationImage: string;
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  uploadReady : Observable<boolean>;
  isFormReady = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cosplayGroupService: CosplayGroupService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private uploadService: UploadImageService
    ) {
      const navigation = this.router.getCurrentNavigation();
      if(navigation.extras.state == undefined) { this.router.navigate(['main/tabs/cosplay-groups']); }
      this.cosplayGroup = navigation?.extras?.state.value;
    }

  ngOnInit() {
    //this.cosplayGroupId = paramMap.get('cosplayGroupId');

    this.form = new FormGroup({
      title: new FormControl(this.cosplayGroup.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      series: new FormControl(this.cosplayGroup.series, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      place: new FormControl(this.cosplayGroup.place, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      dateFrom: new FormControl(this.cosplayGroup.dateFrom, {
        updateOn: 'blur',
      }),
      dateTo: new FormControl(this.cosplayGroup.dateTo, {
        updateOn: 'blur',
      }),
      location: new FormControl(null),
      imageUrl: new FormControl(null)
    });
    this.actualImage = this.cosplayGroup.imageUrl;
    this.actualMapImage = this.cosplayGroup.location.staticMapImageUrl;

    //Use saved info from db
    if(this.form.get('imageUrl').value == null && this.cosplayGroup.imageUrl != null){
      this.form.patchValue({ imageUrl: this.cosplayGroup.imageUrl })
    }
    if(this.form.get('location').value == null && this.cosplayGroup.location != null){
      this.form.patchValue({ location: this.cosplayGroup.location })
    }
    console.log("Form data with saved info: "+ JSON.stringify(this.form.value));
    this.isLoading = false;
 
  }

  //Submit form data ( Cosplay ) when ready
  onUpdateCosplayGroup() {
    if (!this.form.valid) return

    

    this.loadingCtrl
    .create({
      message: 'Updating Cos Group ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const cosplay = this.form.value;
      const cosplayId = this.cosplayGroup?.id || null;
      this.cosplayGroupService.onSaveCosGroup(cosplay, cosplayId);
      console.log(cosplay);

      setTimeout(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/tabs/cosplay-groups']);
      }, 500);

    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  async onImagePicked(imageData: string | File) {
    this.isFormReady = false;

    this.uploadService
          .fullUploadProcess(imageData,this.form)
          .then((val) =>{
            this.isFormReady = val;
            console.log("formReady: "+val);
          })
          .catch(err => {
            console.log(err);
          });
  }

  ngOnDestroy() {
    if (this.cosplayGroupSub) {
      this.cosplayGroupSub.unsubscribe();
    }
  }

}
