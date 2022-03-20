import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CosplaysService } from '../../../../services/cosplays.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../../../models/cosplay.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UploadImageService } from 'src/app/services/upload-img.service';

@Component({
  selector: 'app-edit-cosplay',
  templateUrl: './edit-cosplay.page.html',
  styleUrls: ['./edit-cosplay.page.scss'],
})
export class EditCosplayPage implements OnInit, OnDestroy {
  cosplay: any;
  cosplayId: string;
  private cosplaySub: Subscription;
  isLoading = true;
  form: FormGroup;
  actualImage : string = '';

  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  uploadReady : Observable<boolean>;
  isFormReady = false;

  constructor(
    private route: ActivatedRoute,
    private cosplayService: CosplaysService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cosplaysService: CosplaysService,
    private imgService : UploadImageService,
    private uploadService: UploadImageService
  ) {
    console.log("Entrando en edit cosplay");
    
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

          this.buildForm();
      
          //Use saved info from db
          if(this.form.get('imageUrl').value == null && this.cosplay.imageUrl != null){
            this.form.patchValue({ imageUrl: this.cosplay.imageUrl })
            
          }
          console.log("Form data with saved info: "+ JSON.stringify(this.form.value));
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

  buildForm(){
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
      imageUrl: new FormControl(null)
    });
    
    this.getImageByFbUrl(this.cosplay.imageUrl,2).then((val)=>{
      this.actualImage = val;
      //Use saved info from db
      if(this.form.get('imageUrl').value == null && this.cosplay.imageUrl != null){
        this.form.patchValue({ imageUrl: this.cosplay.imageUrl })
      }
    })

    
    console.log("Form data with saved info: "+ JSON.stringify(this.form.value));
    this.isLoading = false;
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
      const cosplay = this.form.value;
      const cosplayId = this.cosplay?.id || null;
      this.cosplaysService.onSaveCosplay(cosplay, cosplayId);
      console.log(cosplay);

      setTimeout(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/tabs/cosplays/my-cosplays']);
      }, 500);

    });
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
    if (this.cosplaySub) {
      this.cosplaySub.unsubscribe();
    }
  }

}
