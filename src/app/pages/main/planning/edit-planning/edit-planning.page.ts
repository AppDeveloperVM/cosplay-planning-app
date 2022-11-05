import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { PlanningService } from '../../../../services/planning.service';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../../models/location.model';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-planning',
  templateUrl: './edit-planning.page.html',
  styleUrls: ['./edit-planning.page.scss'],
})
export class EditPlanningPage implements OnInit, OnDestroy {
  planning: any;
  planningId: string;
  private planningSub: Subscription;
  form: FormGroup;

  selectedLocationImage: string;

  oldImgName = "";
  imageName = "";
  imgSrc = "";
  actualMapImage = "";

  isLoading = true;
  imageChanged = false;
  isFormReady = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private imgService : UploadImageService,
    private uploadService: UploadImageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private storageService : StorageService
  ) { 
    console.log("Entrando en edit planning");

  }

  ngOnInit() {
    
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('planningId')) {
        this.navCtrl.navigateBack('/main/tabs/planning');
        return;
      }
      this.isLoading = true;
      console.log('Searched for planningId: '+ paramMap.get('planningId'));

      //Getting the planning by Id
      this.planning = this.planningService
      .getPlanningById(paramMap.get('planningId'))
      .subscribe(planning => {
        this.planning = planning;

        if(planning!= null){
          this.buildForm();

          if(this.planning?.imageUrl !== null && this.imageChanged == false){
            this.assignImage();
          }

        } else {
          console.log("Error loading item - not found");
          this.router.navigate(['/main/tabs/planning']);
        }

        console.log("Form data with saved info: "+ JSON.stringify(this.form.value));
        this.isLoading = false;

      },error => {
        //Show alert with defined error message
        this.alertCtrl
        .create({
          header: 'An error ocurred!',
          message: 'Could not load planning. Try again later. Error:'+error,
          buttons: [{
            text: 'Okay',
            handler: () => {
              this.router.navigate(['/main/tabs/planning']);
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
      title: new FormControl(this.planning.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.planning.description, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      startsAt: new FormControl(this.planning.startsAt, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      endsAt: new FormControl(this.planning.endsAt, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      location: new FormControl(this.planning.location),
      imageUrl: new FormControl(this.planning.imageUrl)
    });

    //Use saved info from db
    this.getImageByFbUrl(this.planning.imageUrl,2).then((val)=>{
      this.imgSrc = val;
      //Use saved info from db
      if(this.form.get('imageUrl').value == null && this.planning.imageUrl != null){
        this.form.patchValue({ imageUrl: this.planning.imageUrl })
      }
    })

    //if(this.form.get('location').value == null && this.planning.location != null){
      this.form.patchValue({ location : this.planning.location });
    //}

    this.actualMapImage = this.planning.location.staticMapImageUrl;

  }

  assignImage(){
    this.imageName = this.planning.imageUrl;
    this.oldImgName = this.planning.imageUrl;

    this.getImageByFbUrl(this.planning.imageUrl, 2)
      .then((val)=>{
        console.log('img to assign: ' + val);
        
        this.imgSrc = val;
        //Use saved info from db
        if(this.form.get('imageUrl').value == null && this.planning.imageUrl != null){
          this.form.patchValue({ imageUrl: this.planning.imageUrl })
        }
      })
      .catch( (err) => {
        console.log('error obtaining data  : ' + err);
      });

  }

  getImageByFbUrl(imageName: string, size: number){
    return this.imgService.getStorageImgUrl(imageName,size);
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

  //Submit form data ( Planning ) when ready
  onUpdatePlanning() {
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Updating Planning ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const planning = this.form.value;
      const planningId = this.planning?.id || null;
      this.planningService.onSavePlanning(planning, planningId)
      .then( (res) => {
        console.log('image to delete : ' + this.oldImgName);
        
        if(this.imageChanged && this.imageName !== this.oldImgName){
          this.storageService.deleteThumbnail(this.oldImgName);
        }
      }) 
      .catch( (err) => {
        console.log(err);
      });

      console.log(planning);

      setTimeout(() => {
        loadingEl.dismiss();
        console.log("Form values: " + this.form);
        this.form.reset();
        this.router.navigate(['main/tabs/planning']);
      }, 500);

    });
  }

  ngOnDestroy() {
    if (this.planningSub) {
      this.planningSub.unsubscribe();
    }
  }

}
