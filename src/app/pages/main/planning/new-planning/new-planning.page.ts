import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective, UntypedFormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../../models/location.model';
import { PlanningService } from '../../../../services/planning.service';
//FireBase
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadImageService } from '../../../../services/upload-img.service';
import { FirebaseStorageService } from '../../../../services/firebase-storage.service';
import { PlanningInterface } from 'src/app/models/planning.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-new-planning',
  templateUrl: './new-planning.page.html',
  styleUrls: ['./new-planning.page.scss'],
})
export class NewPlanningPage implements OnInit {
  form: UntypedFormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  planning: PlanningInterface;
  minDate: string;
  startsAt: string;
  endsAt: string;
  isFormReady = true;
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  urlImage: String;
  isSubmitted= false;

  constructor(
    private loadingCtrl: LoadingController,
    private planningService: PlanningService,
    private router: Router,
    private storage: AngularFireStorage,
    private uploadService: UploadImageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.planning = navigation?.extras?.state?.value;

    this.minDate = new Date().toISOString();
    this.startsAt = new Date().toISOString();
    this.endsAt = new Date(new Date(this.startsAt).getTime()).toISOString();
  }

  ngOnInit() {
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new UntypedFormControl(null, {
        updateOn: 'blur'
      }),
      startsAt: new UntypedFormControl(null, {
        updateOn: 'blur'
      }),
      endsAt: new UntypedFormControl(null, {
        updateOn: 'blur'
      }),
      location: new UntypedFormControl(null, {
        validators: [Validators.required]
      }),
      imageUrl: new UntypedFormControl(null)
    });

  }

  changedFromDate(startsAt){
    //startDATE.detail.value
    console.log(startsAt.detail.value);
    this.endsAt = startsAt.detail.value
    //console.log(new Date(startDate).toISOString());
    //this.endDate = new Date(startDate).toISOString();
  }

  clearDates(){
    this.form.patchValue({ startsAt : null, endsAt : null});
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  async onImagePicked(imageData: string | File) {
    this.isFormReady = false;

    this.uploadService
          .fullUploadProcess(imageData,this.form)
          .then((val) =>{
            this.isFormReady = true;
            console.log("formReady: "+val);
          })
          .catch(err => {
            console.log(err);
          });

  }

  
  onSavePlanning() {
    this.isSubmitted = true;

    if (!this.form.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.form.value)
    }

    this.loadingCtrl
    .create({
      message: 'Creating Planning...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const cosGroup = this.form.value;
      const cosGroupId = this.planning?.id || null;
      this.planningService.onSavePlanning(cosGroup, cosGroupId)

      loadingEl.dismiss();
      this.form.reset();
      this.router.navigate(['main/tabs/planning']);
    });
    
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.form.get('dob').setValue(date, {
      onlyself: true
    })
  }

  get errorControl() {
    return this.form.controls;
  }

}
