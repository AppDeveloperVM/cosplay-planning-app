import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseStorageService } from './firebase-storage.service';


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

    storageref;

    //create Form component for the Image Upload
    public archivoForm = new FormGroup({
        archivo: new FormControl(null, Validators.required),
    });
      
    //Evento que se gatilla cuando el input de tipo archivo cambia
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
    }


}