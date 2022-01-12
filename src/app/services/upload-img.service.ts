import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
    providedIn: 'root'
})
export class UploadImageService {
//Upload Img to FireStore

    constructor(
        private storage: AngularFireStorage
    ) { }

    //Tarea para subir archivo
    public uploadCloudStorage(nombreArchivo: string, datos: any) {
        return this.storage.upload(nombreArchivo, datos);
    }

    //Referencia del archivo
    public referenceCloudStorage(nombreArchivo: string) {
        return this.storage.ref(nombreArchivo);
    }

}