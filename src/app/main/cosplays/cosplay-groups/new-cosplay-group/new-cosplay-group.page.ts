import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../../../../services/cosplay-group.service';
import { Router } from '@angular/router';
import { PlaceLocation } from '../../../../models/location.model';
import { finalize, switchMap } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { CosGroup } from 'src/app/models/cosGroup.interface';

import { UploadImageService } from '../../../../services/upload-img.service';
import { FirebaseStorageService } from '../../../../services/firebase-storage.service';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
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
  selector: 'app-new-cosplay-group',
  templateUrl: './new-cosplay-group.page.html',
  styleUrls: ['./new-cosplay-group.page.scss'],
})
export class NewCosplayGroupPage implements OnInit {
  form: FormGroup;
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;
  cosGroup: CosGroup;
  isLoading: boolean = false;
  isFormReady = false;
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
  }

  ngOnInit() {
    const availableFrom = new Date();
    const availableTo = new Date();

    this.startDate = new Date().toISOString();
    this.endDate = new Date(new Date(this.startDate).getTime()).toISOString();

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      series: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      place: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      location: new FormControl(null, {validators: [Validators.required]}),
      imageUrl: new FormControl(null)
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
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

    //UPLOAD IMAGE
    const id = Math.random().toString(36).substring(2);
    const file = imageFile;
    const filePath = `images/${id}`;// Image path + fileName  ||  can add profile_${id}
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe( 
      finalize(() => {
        this.ImageObs = ref.getDownloadURL()
        this.ImageObs.subscribe(
          url=>{
            this.urlImage = url
            console.log('Value:' + this.urlImage);
            this.form.patchValue({ imageUrl: this.urlImage })
            this.isFormReady = true;
          }
        );
      })
    ).subscribe(
      value => {},
      error => console.log('Error:'+ error),
      () => { 
      }
    );

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

      this.router.navigate(['main/tabs/cosplays/cosplay-groups']);
    });
    
  }


}
