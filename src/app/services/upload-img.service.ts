import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firebaseConfig } from 'src/environments/environment';
import { FirebaseStorageService } from './firebase-storage.service';
import firebase from 'firebase/compat/app';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import imageCompression from 'browser-image-compression';


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
  
@Injectable({
    providedIn: 'root'
})
export class UploadImageService {

    constructor(
        private storage: AngularFireStorage,
        private firebaseStorageServ: FirebaseStorageService
    ) { }

    form: FormGroup;
    imgReference;
    public URLPublica = '';
    isFormReady = false;
    uploadPercent: Observable<number>;
    ImageObs: Observable<string>;
    urlImage: String;

    //create Form component for the Image Upload
    public archivoForm = new FormGroup({
        archivo: new FormControl(null, Validators.required),
    });


    async compressFile(imageFile,maxWidth = 1920){
      console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
      console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: maxWidth,//1920
        useWebWorker: true
      }
  
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
  
      return compressedFile;
    }
  
    uploadToServer(imageFile,form : FormGroup) {
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
  
  

}