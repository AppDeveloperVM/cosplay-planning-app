import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../../../models/cosplay.model';
import { CosplaysService } from '../../../../services/cosplays.service';
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
import { Toast } from '@capacitor/core';


@Component({
  selector: 'app-new-cosplay',
  templateUrl: './new-cosplay.page.html',
  styleUrls: ['./new-cosplay.page.scss'],
})
export class NewCosplayPage implements OnInit {
  form: FormGroup;
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

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      characterName: new FormControl('', Validators.required),
      series: new FormControl('', Validators.required),
      description: new FormControl(''),
      imageUrl: new FormControl(null)
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
