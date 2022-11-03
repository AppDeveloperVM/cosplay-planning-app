import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { Observable, Subscription } from 'rxjs';
import { NavController, ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CosplayGroupService } from '../../../../services/cosplay-group.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../../models/location.model';
import { UploadImageService } from 'src/app/services/upload-img.service';


@Component({
  selector: 'app-edit-cosplay-group',
  templateUrl: './edit-cosplay-group.page.html',
  styleUrls: ['./edit-cosplay-group.page.scss'],
})
export class EditCosplayGroupPage implements OnInit, OnDestroy {
  cosplayGroup: any;
  cosplayGroupId: string;
  private cosplayGroupSub: Subscription;
  isLoading = true;

  form: FormGroup;
  validations = null;
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
    private uploadService: UploadImageService,
    private imgService : UploadImageService
    ) {
      this.validations = {
        'title': [
          { type: 'required', message: 'Name is required.' },
          { type: 'maxlength', message: 'Name cannot be more than 100 characters long.' },
        ],
        'series': [
          { type: 'required', message: 'Series is required.' },
          { type: 'maxlength', message: 'Cost cannot be more than 180 characters long.' },
        ],
        'description': [
          { type: 'maxlength', message: 'Cost cannot be more than 180 characters long.' },
        ],
        'place': [
          { type: 'maxlength', message: 'Cost cannot be more than 180 characters long.' },
        ],
        'dateFrom': [
          { type: 'required', message: 'Initial Date is required.' },
        ],
        'dateTo': [
          { type: 'required', message: 'Final Date is required.' },
        ]
        // other validations
      };
    }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayGroupId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/my-cosplays');
        return;
      }

      this.isLoading = true;
      console.log('Searched for cosplayId: '+ paramMap.get('cosplayGroupId'));

      this.cosplayGroupSub = this.cosplayGroupService
      .getCosGroupById(paramMap.get('cosplayGroupId'))
      .subscribe(cosplay => {
        this.cosplayGroup = cosplay;

        if(cosplay!= null){

          this.buildForm();
      
          //Use saved info from db
          if(this.form.get('imageUrl').value == null && this.cosplayGroup.imageUrl != null){
            this.form.patchValue({ imageUrl: this.cosplayGroup.imageUrl })
            
          }
          console.log("Form data with saved info: "+ JSON.stringify(this.form.value));
        }else{
          console.log("Error loading item - not found");
          this.router.navigate(['/main/tabs/cosplay-groups']);
        }
        
        this.isLoading = false;
      }, error => {
        //Show alert with defined error message
        this.alertCtrl
        .create({
          header: 'An error ocurred!',
          message: 'Could not load cosplay. Try again later. Error:'+error,
          buttons: [{
            text: 'Okay',
            handler: () => {
              this.router.navigate(['/main/tabs/cosplays/my-cosplays']);
            }
          }]
        }).then(alertEl => {
          alertEl.present();
        });
      })

    });

  }

  buildForm(){
    this.form = new FormGroup({
      title: new FormControl(this.cosplayGroup.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      series: new FormControl(this.cosplayGroup.series, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      description: new FormControl(this.cosplayGroup.description, {
        updateOn: 'blur',
        validators: [ Validators.maxLength(180) ]
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

    this.getImageByFbUrl(this.cosplayGroup.imageUrl,2).then((val)=>{
      this.actualImage = val;
      //Use saved info from db
      if(this.form.get('imageUrl').value == null && this.cosplayGroup.imageUrl != null){
        this.form.patchValue({ imageUrl: this.cosplayGroup.imageUrl })
      }
    })
    //Use saved info from db
    if(this.form.get('location').value == null && this.cosplayGroup.location != null){
      this.form.patchValue({ location: this.cosplayGroup.location })
    }

    this.actualMapImage = this.cosplayGroup.location.staticMapImageUrl;
    console.log("Form data with saved info: "+ JSON.stringify(this.form.value));
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

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  ngOnDestroy() {
    if (this.cosplayGroupSub) {
      this.cosplayGroupSub.unsubscribe();
    }
  }

}
