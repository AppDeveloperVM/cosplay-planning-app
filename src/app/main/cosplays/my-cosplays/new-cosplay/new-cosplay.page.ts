import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { CosplaysService } from '../../../../services/cosplays.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ImageUploaderComponent } from 'src/app/shared/uploaders/image-uploader/image-uploader.component';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { map } from 'leaflet';
import imageCompression from 'browser-image-compression';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { Toast } from '@capacitor/core';


/* function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
} */

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
  isFormReady = false;
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
