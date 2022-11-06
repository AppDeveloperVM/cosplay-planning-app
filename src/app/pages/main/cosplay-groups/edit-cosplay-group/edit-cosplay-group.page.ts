import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { Observable, Subscription } from 'rxjs';
import { NavController, ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CosplayGroupService } from '../../../../services/cosplay-group.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../../models/location.model';
import { UploadImageService } from '../../../../services/upload-img.service';
import { StorageService } from '../../../../services/storage.service';


@Component({
  selector: 'app-edit-cosplay-group',
  templateUrl: './edit-cosplay-group.page.html',
  styleUrls: ['./edit-cosplay-group.page.scss'],
})
export class EditCosplayGroupPage implements OnInit, OnDestroy {
  cosplayGroup: any;
  cosplayGroupId: string;
  private cosplayGroupSub: Subscription;
  form: UntypedFormGroup;
  validations = null;

  selectedLocationImage: string;
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  uploadReady : Observable<boolean>;

  oldImgName = "";
  imageName = "";
  imgSrc : string = '';
  actualMapImage = "";

  isLoading = true;
  isFormReady = false;
  imageChanged = false;
  dataUpdated = false;

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
    private imgService : UploadImageService,
    private storageService : StorageService
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

          if(this.cosplayGroup?.imageUrl !== null && this.imageChanged == false){
            //Use saved info from db
            this.assignImage();
          }
          
          //Location
          if(this.form.get('location').value == null && this.cosplayGroup.location != null){
            this.form.patchValue({ location: this.cosplayGroup.location })
          }
      
          this.actualMapImage = this.cosplayGroup.location?.staticMapImageUrl ? this.cosplayGroup.location.staticMapImageUrl : null;
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
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl(this.cosplayGroup.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      series: new UntypedFormControl(this.cosplayGroup.series, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      description: new UntypedFormControl(this.cosplayGroup.description, {
        updateOn: 'blur',
        validators: [ Validators.maxLength(180) ]
      }),
      place: new UntypedFormControl(this.cosplayGroup.place, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      dateFrom: new UntypedFormControl(this.cosplayGroup.dateFrom, {
        updateOn: 'blur',
      }),
      dateTo: new UntypedFormControl(this.cosplayGroup.dateTo, {
        updateOn: 'blur',
      }),
      location: new UntypedFormControl(null),
      imageUrl: new UntypedFormControl(null)
    });
 
  }

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  assignImage(){
    this.imageName = this.cosplayGroup.imageUrl;
    this.oldImgName = this.cosplayGroup.imageUrl;

    this.getImageByFbUrl(this.cosplayGroup.imageUrl, 2)
      .then((val)=>{
        console.log('img to assign: ' + val);
        
        this.imgSrc = val;
        //Use saved info from db
        if(this.form.get('imageUrl').value == null && this.cosplayGroup.imageUrl != null){
          this.form.patchValue({ imageUrl: this.cosplayGroup.imageUrl })
        }
      })
      .catch( (err) => {
        console.log('error obtaining data  : ' + err);
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
      const name = val.split('_')[0];
      this.imageName = name;
      console.log('imgName : ' + name);
      console.log('Old imgName : ' + this.oldImgName);
      this.getImageByFbUrl(this.imageName, 2)
      .then( (res) => {
        this.imgSrc = res;
        this.imageChanged = true;
        this.isFormReady = true;
        console.log('imgSrc : ' + res);
      } )
      .catch();

      console.log("formReady, img src : "+ name );
    })
    .catch(err => {
      console.log(err);
    });

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
      this.cosplayGroupService.onSaveCosGroup(cosplay, cosplayId)
      .then( (res) => {
        console.log('image to delete : ' + this.oldImgName);
        
        if(this.imageChanged && this.imageName !== this.oldImgName){
          this.storageService.deleteThumbnail(this.oldImgName);
        }
        this.dataUpdated = true;
      }) 
      .catch( (err) => {
        console.log(err);
      });


      console.log(cosplay);

      setTimeout(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/tabs/cosplay-groups']);
      }, 500);

    });
  }

  ngOnDestroy() {
    if (this.cosplayGroupSub) {
      this.cosplayGroupSub.unsubscribe();
    }
  }

  //Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    //this.unsubscribeBackEvent && this.unsubscribeBackEvent();
    if(this.imageChanged == true && this.dataUpdated == false){
      console.log('delete img not changed : ' + this.imageName);
      
      
      this.storageService.deleteThumbnail(this.imageName);
    }
    
  }

}
