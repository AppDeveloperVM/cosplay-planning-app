import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { firebaseConfig } from '../../environments/environment';
import { FirebaseStorageService } from './firebase-storage.service';
import firebase from 'firebase/compat/app';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import imageCompression from 'browser-image-compression';
import { AlertController } from '@ionic/angular';


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
  imgSizes : any = [140,320,640];
  form: UntypedFormGroup;
  imgReference;
  public URLPublica = '';
  isFormReady = false;
  uploadPercent: Observable<number>;
  ImageObs: Observable<string>;
  urlImage: String;

    constructor(
        private storage: AngularFireStorage,
        private firebaseStorageServ: FirebaseStorageService,
        private alertCtrl: AlertController
    ) { }

    

    //create Form component for the Image Upload
    public archivoForm = new UntypedFormGroup({
        archivo: new UntypedFormControl(null, Validators.required),
    });

    async fullUploadProcess(imageData: string | File, form: UntypedFormGroup): Promise<any> {
      const upload = new Promise(async (resolve, reject) => { 
        try {
          const decodedImage = await this.decodeFile(imageData);
          const imageId = Math.random().toString(36).substring(2);
  
          this.imgSizes.forEach(async (imgSize, index) => {
            try {
              const compressedImage = await this.compressFile(decodedImage, imgSize, index);
              const response = await this.uploadToServer(compressedImage, `${imageId}_${imgSize}`, form, index);
              console.log(`Img ${index} compressed and uploaded successfully.`);
              
              if (index === 2) {
                form.patchValue({ imageUrl: imageId })
                resolve(response);
              }
            } catch (error) {
              console.error(`Error uploading image ${index}: ${error}`);
              reject(error);
            }
          });
        } catch (error) {
          console.log(`Error uploading image: ${error}`);
          reject(error);
        }
      });
  
      return upload;
    }
  

    async decodeFile(imageData: string | File) : Promise<any> {
      let imageFile;

      return new Promise(async (resolve, reject) => {
        if (typeof imageData === 'string') {
          try {
            imageFile = base64toBlob(
            imageData.replace('data:image/jpeg;base64,', ''),'image/jpeg');
            resolve(imageFile);
          } catch (error) {
            console.log(`Base64toBlob error: ${error}`);
            console.log("> DOMException: The string to be decoded is not correctly encoded.");

            let alert = this.alertCtrl.create({
              header: 'Error',
              message: 'Extensión de archivo no admitida.',
              buttons: ['Ok']
            });
            (await alert).present();
            
            reject(error);
          }
        } else {
          imageFile = imageData;
          resolve(imageFile);
        }
      });
    }

    async compressFile(imageFile : File,maxWidth = 1920, index : Number = null) : Promise<any> {
      await console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  
      var promise = new Promise(async (resolve, reject) => {

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: maxWidth,//1920
          useWebWorker: true
        }

        try {
          const compressedFile = await imageCompression(imageFile, options);
          await console.log(`compressedFile `+index+`, size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
          resolve(compressedFile);
        } catch (error) {
          reject('CompressProcess error with file '+index+': '+error);
        }
        
        
      });

      return promise;
    }
  
    async uploadToServer(imageFile, imageId = Math.random().toString(36).substring(2), form : UntypedFormGroup, index : Number = null) : Promise<any> {
      const file = imageFile;
      const filePath = `images/${imageId}`; // Image path + fileName  ||  can add profile_${id}
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      this.uploadPercent = task.percentageChanges();
      try {
          await task.snapshotChanges().pipe(
              finalize(async () => {
                  const downloadURL = await ref.getDownloadURL().toPromise();
                  return downloadURL;
              })
          ).toPromise();
          return { imageId };
      } catch (error) {
          console.log(`Error with img ${index}: ${error}`);
          throw new Error('Error');
      }
    }

    async getStorageImgUrl(fileName: string, size: number): Promise<string> {
      const suffix = this.imgSizes[size] || this.imgSizes[0];
      const file = `${fileName}_${suffix}`;
      const filePath = `images/${file}`;
      const ref = this.storage.ref(filePath);
      const url = await ref.getDownloadURL().toPromise();
      return url;
    }

}