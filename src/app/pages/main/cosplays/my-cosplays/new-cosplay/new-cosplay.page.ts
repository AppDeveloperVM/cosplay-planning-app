import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective, UntypedFormControl, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../../../../models/cosplay.model';
import { CosplaysService } from '../../../../../services/cosplays.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { map } from 'leaflet';
import imageCompression from 'browser-image-compression';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { Toast } from '@capacitor/toast';


@Component({
  selector: 'app-new-cosplay',
  templateUrl: './new-cosplay.page.html',
  styleUrls: ['./new-cosplay.page.scss'],
})
export class NewCosplayPage implements OnInit {
  form: UntypedFormGroup;
  validations = null;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  cosplay: Cosplay;
  imgReference;
  public URLPublica = '';
  isFormReady = true;
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  uploadReady : Observable<boolean>;
  urlImage: String;

  constructor(
    private modalController: ModalController,
    private cosplaysService: CosplaysService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private fbss: FirebaseStorageService,
    private storage: AngularFireStorage,
    private uploadService: UploadImageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    //this.cosGroup = navigation?.extras?.state?.value;
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

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      characterName: new UntypedFormControl('', { validators: [ Validators.required, Validators.maxLength(100)] } ),
      series: new UntypedFormControl('', { validators: [ Validators.required, Validators.maxLength(180)] } ),
      description: new UntypedFormControl('', { validators: [ Validators.maxLength(180)] } ),
      imageUrl: new UntypedFormControl(null)
    });
    
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


  //Submit form data ( Cosplay ) when ready
  onSubmitCosplay() {
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Creating Cosplay ...'
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

}
