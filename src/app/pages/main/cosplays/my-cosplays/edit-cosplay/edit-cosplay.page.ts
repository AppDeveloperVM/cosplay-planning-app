import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CosplaysService } from '../../../../../services/cosplays.service';
import { NavController, LoadingController, AlertController, Platform, IonRouterOutlet } from '@ionic/angular';
import { Cosplay } from '../../../../../models/cosplay.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UploadImageService } from '../../../../../services/upload-img.service';
import { StorageService } from '../../../../../services/storage.service';

@Component({
  selector: 'app-edit-cosplay',
  templateUrl: './edit-cosplay.page.html',
  styleUrls: ['./edit-cosplay.page.scss'],
})
export class EditCosplayPage implements OnInit, OnDestroy {
  cosplay: any;
  cosplayId: string;
  private cosplaySub: Subscription;
  form: FormGroup;
  validations = null;
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  uploadReady : Observable<boolean>;
  
  oldImgName = "";
  imageName = "";
  imgSrc : string = '';

  isLoading = true;
  imageChanged = false;
  isFormReady = false;
  dataUpdated = false;

  // This property will save the callback which we can unsubscribe when we leave this view
  public unsubscribeBackEvent: any;

  constructor(
    private route: ActivatedRoute,
    private cosplayService: CosplaysService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cosplaysService: CosplaysService,
    private imgService : UploadImageService,
    private uploadService: UploadImageService,
    private storageService : StorageService,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet
  ) {
    this.validations = {
      'characterName': [
        { type: 'required', message: 'Name is required.' },
        { type: 'maxlength', message: 'Name cannot be more than 100 characters long.' },
      ],
      'series': [
        { type: 'required', message: 'Series is required.' },
        { type: 'maxlength', message: 'Cost cannot be more than 180 characters long.' },
        { type: 'pattern', message: 'The cost must contain only numbers .' },
      ],
      'description': [
        { type: 'maxlength', message: 'Cost cannot be more than 180 characters long.' },
      ]
      // other validations
    };
  }


  

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('cosplayId')) {
        this.navCtrl.navigateBack('/main/tabs/cosplays/my-cosplays');
        return;
      }

      this.isLoading = true;
      console.log('Searched for cosplayId: '+ paramMap.get('cosplayId'));

      this.cosplaySub = this.cosplaysService
      .getCosplayById(paramMap.get('cosplayId'))
      .subscribe(cosplay => {

        this.cosplay = cosplay;
        if(cosplay!= null){

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
            }),
            imageUrl: new FormControl(this.cosplay?.imageUrl ? this.cosplay?.imageUrl : null)
          });
      
          //console.log('this.cosplay?.imageUrl : ' + this.cosplay?.imageUrl);
          
          if(this.cosplay?.imageUrl !== null && this.imageChanged == false){
            //Use saved info from db
            this.assignImage();
          }
          
          //console.log("Form data with saved info: "+ JSON.stringify(this.form.value));
          this.isLoading = false;

        }else{
          console.log("Error loading item - not found");
          this.router.navigate(['/main/tabs/cosplays/my-cosplays']);
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
      });

    });

  }

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
  }

  assignImage(){
    this.imageName = this.cosplay.imageUrl;
    this.oldImgName = this.cosplay.imageUrl;

    this.getImageByFbUrl(this.cosplay.imageUrl, 2)
      .then((val)=>{
        console.log('img to assign: ' + val);
        
        this.imgSrc = val;
        //Use saved info from db
        if(this.form.get('imageUrl').value == null && this.cosplay.imageUrl != null){
          this.form.patchValue({ imageUrl: this.cosplay.imageUrl })
        }
      })
      .catch( (err) => {
        console.log('error obtaining data  : ' + err);
      });

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
  onUpdateCosplay() {
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Updating Cosplay ...'
    })
    .then(loadingEl => {
      loadingEl.present();

      this.form.patchValue({ imageUrl: this.imageName }); // img updated in form
      const cosplay = this.form.value;      
      const cosplayId = this.cosplay?.id || null;
      
      this.cosplaysService.onSaveCosplay(cosplay, cosplayId)
      .then( (res) => {
        //console.log('image to delete : ' + this.oldImgName);
        
        if(this.imageChanged && this.imageName !== this.oldImgName){
          //this.storageService.deleteThumbnail(this.oldImgName);
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
        this.router.navigate(['main/tabs/cosplays/my-cosplays']);
      }, 500);

    });
  }


  ngOnDestroy() {
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

  //Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    //this.unsubscribeBackEvent && this.unsubscribeBackEvent();
    if(this.imageChanged == true && this.dataUpdated == false){
      //console.log('delete img not changed : ' + this.imageName);

      //this.storageService.deleteThumbnail(this.imageName);
    }
    
  }

}
