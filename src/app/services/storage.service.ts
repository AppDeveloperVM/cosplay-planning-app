import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor( private storage: AngularFireStorage ) { }


  deleteThumbnail(imgName) : Promise<any>{

    const promise = new Promise( (resolve, reject) => {

      //soon, delete cosGallery imgs
      const arr_names = ['140','320','640'];
      arr_names.forEach(size => {

        try {
          const name = imgName + '_' + size;
          const ref = this.storage.storage.ref('/images').child(name).delete();

          ref.then( (res) => {
            console.log('img deleted!');
            resolve(true);
          })
          .catch( (err) => {
            console.log('error : ' + err);
            reject(false);
          })
        } catch(error){
          console.log(error);
        }
        
      });
    });

    return promise;
  }

}
