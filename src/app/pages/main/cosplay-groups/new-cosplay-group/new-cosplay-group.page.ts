import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../../../../services/cosplay-group.service';
import { Router } from '@angular/router';
import { PlaceLocation } from '../../../../models/location.model';
import { finalize, switchMap } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { CosGroup } from 'src/app/models/cosGroup.interface';

import { UploadImageService } from '../../../../services/upload-img.service';
import { FirebaseStorageService } from '../../../../services/firebase-storage.service';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AsyncSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-new-cosplay-group',
  templateUrl: './new-cosplay-group.page.html',
  styleUrls: ['./new-cosplay-group.page.scss'],
})
export class NewCosplayGroupPage implements OnInit {
  form: UntypedFormGroup;
  validations = null;
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() selectedMode: 'select' | 'random';
  //  modes = ['date','datetime','month-year','time-date'];
  minDate: string;
  startDate: string;
  endDate: string;
  cosGroup: CosGroup;
  isLoading: boolean = false;
  isFormReady = true;
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  urlImage: String;

  constructor(
    private cosplayGroupService: CosplayGroupService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private afs: AngularFireStorage,
    private fbss: FirebaseStorageService,
    private uploadService: UploadImageService,
    private storage: AngularFireStorage
  ) {
    const navigation = this.router.getCurrentNavigation();
    //this.cosGroup = navigation?.extras?.state?.value;
 
    this.minDate = new Date().toISOString();
    this.startDate = new Date().toISOString();
    this.endDate = new Date(new Date(this.startDate).getTime()).toISOString();
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
    const dateFrom = new Date();
    const dateTo = new Date();

    this.form = new UntypedFormGroup({
      title: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      series: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      description: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.maxLength(180) ]
      }),
      place: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.maxLength(180) ]
      }),
      dateFrom: new UntypedFormControl(null, {
        updateOn: 'blur'
      }),
      dateTo: new UntypedFormControl(null, {
        updateOn: 'blur'
      }),
      location: new UntypedFormControl(null),
      imageUrl: new UntypedFormControl(null)
    });
  }

  changedFromDate(startDate){
    //startDATE.detail.value
    console.log(startDate.detail.value);
    this.endDate = startDate.detail.value
    //console.log(new Date(startDate).toISOString());
    //this.endDate = new Date(startDate).toISOString();
  }

  clearDates(){
    this.form.patchValue({ dateFrom : null,dateTo : null});
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

  onSaveCosGroup() {
    //this.cosplayGroupService.uploadImage(this.form.get('image').value)
    if (!this.form.valid) {
      console.log('Form invalid');
      return
    }

    this.loadingCtrl
    .create({
      message: 'Creating Cosplay Group...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const cosGroup = this.form.value;
      const cosGroupId = this.cosGroup?.id || null;
      this.cosplayGroupService.onSaveCosGroup(cosGroup, cosGroupId);
      console.log(this.form.value);
      this.form.reset();
      loadingEl.dismiss();

      this.router.navigate(['main/tabs/cosplay-groups']);
    });
    
  }

}