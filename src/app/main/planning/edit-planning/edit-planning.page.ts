import { Component, OnInit, OnDestroy } from '@angular/core';
import { Planning } from '../planning.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { PlanningService } from '../../../services/planning.service';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../models/location.model';
import { UploadImageService } from 'src/app/services/upload-img.service';

@Component({
  selector: 'app-edit-planning',
  templateUrl: './edit-planning.page.html',
  styleUrls: ['./edit-planning.page.scss'],
})
export class EditPlanningPage implements OnInit, OnDestroy {
  planning: any;
  planningId: string;
  isLoading = true;
  private planningSub: Subscription;
  form: FormGroup;
  actualImage = "";
  actualMapImage = "";
  selectedLocationImage: string;
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
    private alertCtrl: AlertController
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
      this.planningService.onSavePlanning(planning, planningId);
      console.log(planning);

      setTimeout(() => {
        loadingEl.dismiss();
        console.log("Form values: " + this.form);
        this.form.reset();
        this.router.navigate(['main/tabs/planning']);
      }, 500);

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
      location: new FormControl(this.planning.location, {validators: [Validators.required]}),
      imageUrl: new FormControl(this.planning.imageUrl)
    });

    //Use saved info from db
    this.getImageByFbUrl(this.planning.imageUrl,2).then((val)=>{
      this.actualImage = val;
      //Use saved info from db
      if(this.form.get('imageUrl').value == null && this.planning.imageUrl != null){
        this.form.patchValue({ imageUrl: this.planning.imageUrl })
      }
    })

    if(this.form.get('location').value == null && this.planning.location != null){
      this.form.patchValue({ image : this.planning.location });
    }

    this.actualMapImage = this.planning.location.staticMapImageUrl;

  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  onImagePicked(imageData: string | File) {
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
    if (this.planningSub) {
      this.planningSub.unsubscribe();
    }
  }

}
