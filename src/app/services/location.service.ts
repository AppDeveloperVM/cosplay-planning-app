
import { CallbackID, Capacitor, Toast } from "@capacitor/core";
import { Injectable } from '@angular/core';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'

import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@capacitor/core';


@Injectable({
    providedIn: 'root'
  })
export class LocationService {

  state: any = { 0 : {center : '', loading: ''}};
  watchId: CallbackID = '';

  constructor() { }

  async checkPermissions(): Promise<Boolean>{
    return await new Promise(async (resolve, reject) => {
      console.log('checking permissions');
      const hasPermission = await this.checkGPSPermission();
      if (hasPermission) {
          if (Capacitor.isNative) {
              const canUseGPS = await this.askToTurnOnGPS();
              this.postGPSPermission(canUseGPS);
          }
          else {
              this.postGPSPermission(true);
          }
          resolve(true)
      }
      else {
          console.log('14');
          const permission = await this.requestGPSPermission();
          if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
              if (Capacitor.isNative) {
                  const canUseGPS = await this.askToTurnOnGPS();
                  this.postGPSPermission(canUseGPS);
              }
              else {
                  this.postGPSPermission(true);
              }
              resolve(true)
          }
          else {
              await Toast.show({
                  text: 'User denied location permission'
              })
              reject(false)
          }
      }
    })
  }

  // Check if application having GPS access permission
  async checkGPSPermission() : Promise<Boolean> {
      return await new Promise((resolve, reject) => {
        console.log('check gps permission');
          if (Capacitor.isNative) {
              AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
                  result => {
                      if (result.hasPermission) {
                          // If having permission show 'Turn On GPS' dialogue
                          resolve(true);
                      } else {
                          // If not having permission ask for permission
                          resolve(false);
                      }
                  },
                  err => { alert(err); }
              );
          }
          else { resolve(true);  }
      })
  }

  async requestGPSPermission(): Promise<string> {
    return await new Promise((resolve, reject) => {
        LocationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                resolve('CAN_REQUEST');
            } else {
                // Show 'GPS Permission Request' dialogue
                AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                    .then(
                        (result) => {
                            if (result.hasPermission) {
                                // call method to turn on GPS
                                resolve('GOT_PERMISSION');
                            } else {
                                resolve('DENIED_PERMISSION');
                            }
                        },
                        error => {
                            // Show alert if user click on 'No Thanks'
                            alert('requestPermission Error requesting location permissions ' + error);
                        }
                    );
            }
        });
    })
  }

  postGPSPermission = async (canUseGPS: boolean) => {
    if (canUseGPS) {
        this.watchPosition();
    }
    else {
        await Toast.show({
            text: 'Please turn on GPS to get location'
        })
    }
  }

  async askToTurnOnGPS(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      console.log('askToTurnOnGps');
        LocationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                // the accuracy option will be ignored by iOS
                LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => {
                        resolve(true);
                    },
                    error => { resolve(false); } );
            }
            else { resolve(false);  }
        });
    })
  }

  watchPosition = async () => {
    try {
        this.state.loading = true;
         this.watchId = Geolocation.watchPosition({}, (position, err) => {
          console.log('watchPosition');
            if (err) {
                return;
            }
            this.state = {
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                },
                loading: false
            }, () => {
                this.clearWatch();
            }})
            
        }
        catch (err) { console.log('err', err) }

    
  }
  

  


  clearWatch() {
    if (this.watchId != null) {
        //Geolocation.clearWatch({ id: this.watchId });
    }
    this.state({
        loading: false
    })
  }

  


}