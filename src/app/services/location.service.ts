import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { Injectable } from '@angular/core';

import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from "@ionic/angular";
import { AddressData } from "../models/addressData.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
  })
export class LocationService {

    isMobile = Capacitor.getPlatform() !== 'web'; 

    latlng: any = {lat : null, lng : null};
    //OpenMapQuest key and url
    KEY = 'hmAnp6GU6CtArMcnLn38nJS0Sb1orh9Q';
    reversegeocodeurl = `https://open.mapquestapi.com/nominatim/v1/reverse.php?key=${this.KEY}&format=json&lat=${this.latlng.lat}&lon=${this.latlng.lng}`;


    state: any = { 0 : {center : '', loading: ''}};
    //watchId: CallbackID = '';
    streetObserv: Observable<any>;
    streetData: any;
    staticMapImageUrl;
    markers : any = [];

    addressInfo : AddressData = {
        full_address: null,
        road: null,
        country: null,
        state: null,
        postal_code: null
    }

  constructor(
    private platform: Platform,
    private httpClient: HttpClient
  ) { }

  async checkPermissions(): Promise<any>{

    return await new Promise(async (resolve, reject) => {
        
      console.log('checking permissions');
      const hasPermission = await this.checkGPSPermission();
      if (hasPermission) {
          if ( Capacitor.isPluginAvailable('Geolocation') ) {
              const canUseGPS = await this.askToTurnOnGPS();
              this.postGPSPermission(canUseGPS);
          }
          else {
              this.postGPSPermission(true);
          }
          resolve(true);
      } else {
          console.log('Doesnt have permissions');
          //const permission = await this.requestGPSPermission();

          Geolocation.requestPermissions()
          .then(async permission => {
            console.log(permission);
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });

          /* if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
              if (Capacitor.isPluginAvailable('Geolocation')) {
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
          } */

      }
    })
  }

  // Check if application having GPS access permission
  async checkGPSPermission() : Promise<Boolean> {
      return await new Promise( (resolve, reject) => {
        console.log('check gps permission');
          if(this.isMobile) {
              /* AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
              .then(
                  (result) => {
                      if (result.hasPermission) {
                          // If having permission show 'Turn On GPS' dialogue
                          resolve(true);
                      } else {
                          // If not having permission ask for permission
                          reject(false);
                      }
                  },
                  err => { alert(err); }
              ); */
              reject(false);
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
                /* AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                    .then(
                        (result) => {
                            if (result.hasPermission) {
                                // call method to turn on GPS
                                resolve('GOT_PERMISSION');
                            } else {
                                reject('DENIED_PERMISSION');
                            }
                        },
                        error => {
                            // Show alert if user click on 'No Thanks'
                            alert('requestPermission Error requesting location permissions ' + error);
                        }
                    ); */
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
            else { reject(false);  }
        });
    })
  }

  watchPosition = async () => {
    try {
        this.state.loading = true;
        //this.watchId = 
         Geolocation.watchPosition({}, (position, err) => {
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
    /* if (this.watchId != null) {
        //Geolocation.clearWatch({ id: this.watchId });
    }
    this.state({
        loading: false
    }) */
  }

  setLocationCoords(lat: number, lng: number){
    this.latlng.lat = lat;
    this.latlng.lng = lng;
    this.reversegeocodeurl = `https://open.mapquestapi.com/nominatim/v1/reverse.php?key=${this.KEY}&format=json&lat=${this.latlng.lat}&lon=${this.latlng.lng}`;
  }

  async getAddressInfo() : Promise<any> {

    return new Promise(  (resolve, reject) => {
        
        let address;
        
        this.streetObserv = this.httpClient.get(this.reversegeocodeurl);
        this.streetObserv
        .subscribe(data => {

            if(data == null){
                reject(false);
            }

            console.log('my data: ', data);
            this.streetData = data;
            const road = this.streetData['address']['road'] != undefined ? this.streetData['address']['road'] : null;
            const county = this.streetData['address']['county'] != undefined ? this.streetData['address']['county'] : null;
            const state = this.streetData['address']['state'] != undefined ? this.streetData['address']['state'] : null;
            //save info if not null
            let fullAddress;
            let fullAddressNotEmpty = [ road, county, state ].filter(function (val) {return val;}).join(', ');
            fullAddress = fullAddressNotEmpty
            console.log("fulladdress: " +fullAddress);
            //Address Info
            this.addressInfo.full_address = fullAddress;
            this.addressInfo.road = road;
            this.addressInfo.state = state;
            this.addressInfo.country = county;
            const staticMapImageUrl = this.getMapImage(this.latlng.lat,this.latlng.lng, 14)
            address = this.addressInfo;
            resolve(address);
            
        });

        
        
    })
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    var KEY = 'hmAnp6GU6CtArMcnLn38nJS0Sb1orh9Q';
    return `https://open.mapquestapi.com/staticmap/v4/getplacemap?key=${KEY}&location=${lat},${lng}&size=600,400&zoom=9&showicon=red_1-1`;
  }

  setMarkersArray(markers:any){
    this.markers = markers;
  }

  async traceRoute() : Promise<any> {

    return new Promise(  (resolve, reject) => {
    try {
        var routeInfo : any = { origin : null, waypoints : null, destination : null};
        var origin = {lat:0,lng:0};
        var destination = {lat:0,lng:0};
        var waypoints = [];
        var waypoints_iteration = 0;
        var iterations = this.markers;

        this.markers.forEach((element,index) => {
            if(index == 0){
            //primer elemento
                origin.lat = element.lat;
                origin.lng = element.lng;
            } else if(index = this.markers.length - 1){
            //ultimo elemento
                destination.lat = element.lat;
                destination.lng = element.lng;
            } else {
                waypoints[index] = { location : element, stopover : false};
            }
        });
        console.log('Origin: ', origin);
        console.log('Waypoints: ', waypoints);
        console.log('Destination: ', destination);
        routeInfo.origin = origin;
        routeInfo.waypoints = waypoints;
        routeInfo.destination = destination;
        resolve(routeInfo);
    } catch(err) {
        reject(err.message)
    }})

  }

}