import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firebaseConfig } from 'src/environments/environment';
import { FirebaseStorageService } from './firebase-storage.service';
import firebase from 'firebase/compat/app';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";

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
//Upload Img to FireStore


    constructor(
        private storage: AngularFireStorage,
        private firebaseStorageServ: FirebaseStorageService
    ) { }

    public mensajeArchivo = 'No hay un archivo seleccionado';
    public datosFormulario = new FormData();
    public nombreArchivo = '';
    public URLPublica = '';
    public porcentaje = 0;
    public finalizado = false;
    form: FormGroup;

    storageref;

    //create Form component for the Image Upload
    public archivoForm = new FormGroup({
        archivo: new FormControl(null, Validators.required),
    });

    async onImagePicked(imageData: string | File) {
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
        const imageName = "images/"+Math.random()+imageFile;
        const datos = imageFile;
    
        // Create a root reference
        const storage = getStorage();
        const storageRef = ref(storage, imageName);// imageName can be whatever name to image
    
        //let tarea = await this.fbss.tareaCloudStorage(imageName,datos).then((r) => {
        uploadBytes(storageRef, imageFile).then((snapshot) => {
          getDownloadURL(storageRef).then((url) => {
            console.log(url);
            this.form.patchValue({ image: url });
          });
          
        })
      }

   /*  //Evento que se gatilla cuando el input de tipo archivo cambia
    public cambioArchivo(event) {
        
        if (event.target.files.length > 0) {
        for (let i = 0; i < event.target.files.length; i++) {
            this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
            this.nombreArchivo = event.target.files[i].name;
            this.datosFormulario.delete('archivo');
            this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
        }
        } else {
        this.mensajeArchivo = 'No hay un archivo seleccionado';
        }
    }

    //Tarea para subir archivo
    public uploadCloudStorage(nombreArchivo: string, datos: any) {
        let referencia = this.firebaseStorageServ.referenciaCloudStorage(nombreArchivo);
        referencia.getDownloadURL().subscribe((URL) => {
            //this.URLPublica = URL;
        });

        //Cambia el porcentaje de subida
        let tarea = this.firebaseStorageServ.tareaCloudStorage(this.nombreArchivo, datos);
        tarea.percentageChanges().subscribe((porcentaje) => {
            this.porcentaje = Math.round(porcentaje);
            if (this.porcentaje == 100) {
                this.finalizado = true;
            }
        });
        return this.storage.upload(nombreArchivo, datos);
     }*/

}