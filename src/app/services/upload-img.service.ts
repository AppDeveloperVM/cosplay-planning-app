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

    constructor(
        private storage: AngularFireStorage,
        private firebaseStorageServ: FirebaseStorageService,
        private alertCtrl: AlertController
    ) { }

    form: UntypedFormGroup;
    imgReference;
    public URLPublica = '';
    isFormReady = false;
    uploadPercent: Observable<number>;
    ImageObs: Observable<string>;
    urlImage: String;

    //create Form component for the Image Upload
    public archivoForm = new UntypedFormGroup({
        archivo: new UntypedFormControl(null, Validators.required),
    });

    async fullUploadProcess(imageData: string | File, form : UntypedFormGroup) : Promise<any> {

      let upload = new Promise(async (resolve, reject) => { 
        await this.decodeFile(imageData)
        .then(
        //Decoded
          async (val) => {

            //const maxWidth = 320;
            //const imgSizes : any = [640,320,170];
            //imageName for upload ( same for all + size)
            const imageId = Math.random().toString(36).substring(2);

            //upload img x times in multiple sizes
            this.imgSizes.forEach( async (imgSize, index) => {

              await this.compressFile(val,imgSize,index)
              .then(
                async (val) => {

                  await this.uploadToServer(val,imageId +"_"+imgSize,form, index)
                  .then(
                    //Compressed and Uploaded Img to FireStorage
                    (val) => {
                      if(index == 0){
                        
                      }else if(index == 2){
                        console.log("index: "+index);
                        form.patchValue({ imageUrl: imageId })
                        resolve(val);
                      }
                      
                      console.log("Img "+ index +" Compressed and Uploaded Successfully.")

                    },
                    (err) => console.error("Uploading error with img "+ index +" : "+err)
                  ).catch(err => {
                    console.log(err);
                    reject(err);
                  });
                  
                },
                (err) => console.log("Compressing error with img "+ index +" : "+err)
              ).catch(async err => {
                console.log(await err);
              });

            })

          },
          (err) => console.log("Decoding Error: "+err)
        ).catch(async err => {
          console.log(await err);
        });
      });

      return upload;
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
  
    uploadToServer(imageFile,imageId = Math.random().toString(36).substring(2) ,form : UntypedFormGroup, index : Number = null) : Promise<any> {

      var promise = new Promise((resolve, reject) => {
      
        //UPLOAD IMAGE
        
        const file = imageFile;
        const filePath = `images/${imageId}`;// Image path + fileName  ||  can add profile_${id}
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        var imageUrl = "";
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe( 
          finalize(() => {
            /*
            this.ImageObs = ref.getDownloadURL()
            this.ImageObs.subscribe(
              url=>{
                imageUrl = url;
                console.log('Value:' + imageUrl);
                
                  resolve(url)
              
              }
            );
            */
            resolve(imageId)
          })
        ).subscribe(
          //percentage Changes..
          value => {console.log("Upload "+index+". Transferred: "+value.bytesTransferred + " of total :"+ value.totalBytes)},
          error => { 
            console.log('Error with img '+index+':'+ error); 
            reject("Error.") 
          },
          () => { 
          }
        );


      });//finishes promise
        return promise;
    }

    async getStorageImgUrl(fileName: String, size : Number) : Promise<any> {

      return new Promise((resolve, reject) => {
        
        let file = '';
        let suffix = '';
        switch(size){
          //0 the smallest
          case 0: suffix = this.imgSizes[0];
            break;
          case 1: suffix = this.imgSizes[1];
            break;
          case 2: suffix = this.imgSizes[2];
            break;
          default: suffix = this.imgSizes[0];
        }
        file = fileName + "_" + suffix;

        const filePath = `images/${file}`;
        const ref = this.storage.ref(filePath);

        /* const storage = getStorage();
        const storageRef = ref(storage, filePath);
        getDownloadURL(storageRef)
        .then(url => {
        }) */

        var imageUrl = "";
        //console.log(ref.getDownloadURL());
        
        this.ImageObs = ref.getDownloadURL();  

          this.ImageObs.subscribe(
            url=>{
              imageUrl = url;
              console.log('Value:' + imageUrl);
                resolve(url)
            }, error => {
              //console.log(error);
              var custom_err = "";
              var regex = /\(([^)]+)\)/; // get msg inside parenthesis
              var err_mssg = regex.exec(error)[1];              
      
              switch(err_mssg){
                case 'storage/object-not-found':
                  custom_err = 'Image not found';
                break;
              }
              reject(custom_err);
            }
          );

      })
      

   }

}