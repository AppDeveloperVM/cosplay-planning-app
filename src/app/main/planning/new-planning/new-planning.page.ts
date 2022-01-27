import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../models/location.model';
import { PlanningService } from '../../../services/planning.service';
//FireBase
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadImageService } from '../../../services/upload-img.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { PlanningInterface } from 'src/app/models/planning.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-new-planning',
  templateUrl: './new-planning.page.html',
  styleUrls: ['./new-planning.page.scss'],
})
export class NewPlanningPage implements OnInit {
  form: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  planning: PlanningInterface;
  isFormReady = false;
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
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur'
      }),
      startsAt: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      endsAt: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      imageUrl: new FormControl(null)
    });

  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  async onImagePicked(imageData: string | File) {
    this.isFormReady = false;

    await this.uploadService.decodeFile(imageData)
    .then(
      //Decoded
      async (val) => {
        const maxWidth = 320;
        await this.uploadService.compressFile(val,maxWidth).then(
          async (val) => {
            await this.uploadService.uploadToServer(val,this.form)
            .then(
              //Compressed and Uploaded Img to FireStorage
              (val) => {
                this.form.patchValue({ imageUrl: val })
                console.log("Img Compressed and Uploaded Successfully.")
                this.isFormReady = true;
              },
              (err) => console.error("Uploading error : "+err)
            ).catch(err => {
              console.log(err);
            });
          },
          (err) => console.log("Compressing error : "+err)
        ).catch(err => {
          console.log(err);
        });
      },
      (err) => console.log("Decoding Error: "+err)
    ).catch(err => {
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
