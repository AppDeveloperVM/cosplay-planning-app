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


function base64toBlob(base64Data, contentType) {
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
}

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
  urlImage: Observable<string>;

  constructor(
    private modalController: ModalController,
    private cosplaysService: CosplaysService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private fbss: FirebaseStorageService,
    private storage: AngularFireStorage
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
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    //this.form.patchValue({image: imageFile});
    //UPLOAD IMAGE
    const imageName = Math.random()+imageFile;

    // Create a root reference
    const storage = getStorage();
    const storageRef = ref(storage, encodeURIComponent("images/"+imageName) );// imageName can be whatever name to image

    const id = Math.random().toString(36).substring(2);
    const file = imageFile;
    const filePath = `images`;// can add profile_${id}
    //const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    //this.uploadPercent = task.percentageChanges();

    //UPLOAD IMAGE
    uploadBytes(storageRef, imageFile).then((snapshot) => {
      getDownloadURL(storageRef).then((url) => {
        this.isFormReady = true;
        console.log(url);
        this.form.patchValue({ imageUrl: url });
      });
      
    })
  }

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

  /* onCreateCosplay() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
    .create({
      message: 'Creating Cosplay...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.cosplaysService.
      uploadImage(this.form.get('image').value)
      .pipe(
        switchMap(uploadRes => {
          return this.cosplaysService
          .addCosplay(
            this.form.value.characterName,
            this.form.value.description,
            uploadRes.imageUrl,
            this.form.value.series,
            0,
            '0',
            false
          );
        }))
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/main/tabs/cosplays/my-cosplays']);
      });
    });

  } */

}
  function uploadFile(event: Event) {
    throw new Error('Function not implemented.');
  }

