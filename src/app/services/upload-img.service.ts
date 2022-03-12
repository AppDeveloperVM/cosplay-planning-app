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
  imgSizes : any = [640,320,170];

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

    async fullUploadProcess(imageData: string | File, form : FormGroup, processReady : boolean) : Promise<any> {

      let uploadResults : any = [];

      this.decodeFile(imageData)
      .then(
        //Decoded
        () => {
          //run compress and upload 3 times ( small, medium , big img)
          let loop = new Promise((resolve, reject) => {
            this.imgSizes.forEach(function (imgSize, index) {
              async (val) => {
                const maxWidth = imgSize;
    
                await this.compressFile(val,maxWidth)
                .then(
                  (val) => {
                    async (val) => {
                      await this.uploadToServer(val,form)
                      .then(
                        //Compressed and Uploaded Img to FireStorage
                        (val) => {
                          this.form.patchValue({ imageUrl: val })
                          console.log("Img "+index+" Compressed and Uploaded Successfully.")
    
                          uploadResults.push();
                          
                        },
                        (err) => console.error("Uploading error with img "+index+" : "+err)
                      ).catch(err => {
                        console.log(err);
                      });
                    }
                  },
                  (err) => console.error("Uploading error , img "+index+" : "+err)
                ).catch(err => {
                  console.log(err);
                });
    
              }
            })
          })

          loop.then(() => {
            //check for errors in the upload process and then return formReady
            processReady = true;
          }).catch(err => {
            console.log('Error uploading files.');
          })
        }

      )
      .catch(err => {
        console.log(err);
      })


    }

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

    async compressFile(imageFile : File,maxWidth = 1920) : Promise<any> {
      await console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  
      var promise = new Promise(async (resolve, reject) => {

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: maxWidth,//1920
          useWebWorker: true
        }

        try {
          const compressedFile = await imageCompression(imageFile, options);
          await console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
          resolve(compressedFile);
        } catch (error) {
          reject(error);
        }
        
        
      });

      return promise;
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