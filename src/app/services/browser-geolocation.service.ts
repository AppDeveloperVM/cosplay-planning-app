import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { latLng } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class BrowserGeolocationService {
  latitude = null;
  longitude = null;
  actualLocation = latLng(null,null);

  constructor( private geolocation: Geolocation ) 
    {

    }


    async requestGeolocationPermission() : Promise<any> {

      const promise = new Promise((resolve, reject) => {

        try {
          this.geolocation.getCurrentPosition()
          .then((resp) => {
            console.log(resp)
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
            //this.getAddress(this.latitude, this.longitude);
            this.actualLocation = latLng(this.latitude, this.longitude);
            resolve(this.actualLocation);
          })
          .catch((error) => {
            reject(error);
          });
        }catch(err){
          console.log('try catch error, ' + err);
        }
      });

      return promise;
    }


}


