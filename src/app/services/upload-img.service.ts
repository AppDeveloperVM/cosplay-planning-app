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

    constructor(
        private storage: AngularFireStorage,
        private firebaseStorageServ: FirebaseStorageService,
        private alertCtrl: AlertController
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

    async decodeFile(imageData: string | File) : Promise<any> {
      let imageFile;

      var promise = new Promise(async (resolve, reject) => {
      
        if (typeof imageData === 'string') {
          try {
            imageFile = base64toBlob(
              imageData.replace('data:image/jpeg;base64,', ''),
              'image/jpeg');
              resolve(imageFile);
          } catch (error) {
            //console.log(error);
            console.log("Base64toBlob Error.");
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

      return promise;

    }

    async compressFile(imageFile : File,maxWidth = 1920){
      //console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
      await console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: maxWidth,//1920
        useWebWorker: true
      }
  
      const compressedFile = await imageCompression(imageFile, options);
      //console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      await console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
  
      return compressedFile;
    }
  
    uploadToServer(imageFile,form : FormGroup) : Promise<any> {

      var promise = new Promise((resolve, reject) => {
      
        //UPLOAD IMAGE
        const id = Math.random().toString(36).substring(2);
        const file = imageFile;
        const filePath = `images/${id}`;// Image path + fileName  ||  can add profile_${id}
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        var imageUrl = "";
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe( 
          finalize(() => {
            this.ImageObs = ref.getDownloadURL()
            this.ImageObs.subscribe(
              url=>{
                imageUrl = url;
                console.log('Value:' + imageUrl);
                
                  resolve(url)
              
              }
            );
          })
        ).subscribe(
          //percentage Changes..
          value => {console.log("Upload. Transferred: "+value.bytesTransferred + " of total :"+ value.totalBytes)},
          error => { 
            console.log('Error:'+ error); 
            reject("Error.") 
          },
          () => { 
          }
        );


      });//finishes promise
        return promise;
    }

}