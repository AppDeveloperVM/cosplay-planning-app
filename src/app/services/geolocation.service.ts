import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isPlatform, Platform } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Http } from '@capacitor-community/http';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Toast } from '@capacitor/toast';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { AddressData } from 'app/models/addressData.model';


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {  
  isMobile = Capacitor.getPlatform() !== 'web'; 
  //HERE api key
  KEY = 'VAoFjQOKPlpfD9WAbLgg4kYC3YBVSt8811TxV6hf2Pg';
  //'pk.eyJ1Ijoidm1tYXBkZXZlbG9wZXIiLCJhIjoiY2w0bXQ2bzdyMGZzNDNjbnM2YTllaDVlbyJ9.KJMSxBbt482Bs-1ihJZoVg';
  //https://api.mymappi.com/v2/geocoding/reverse VAoFjQOKPlpfD9WAbLgg4kYC3YBVSt8811TxV6hf2Pg
  reversegeocodeurl = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
  staticimageurl = `https://api.mapbox.com/styles/v1`; 

  latlng: any = {lat : null, lng : null};
  state: any = { };
  markers : any = [];
  streetObserv: Observable<any>;
  streetData: any;
  staticMapImageUrl;

  

  addressInfo : AddressData = {
    full_address: null,
    road: null,
    country: null,
    state: null,
    postal_code: null
  }

  locationData = {
    addressInfo: this.addressInfo,
    staticMapImageUrl: null
  }

  constructor(
    private platform: Platform,
    private httpClient: HttpClient
  ) { }

   //-- GETTING LOCATION PERMISSIONS --------------------

  async checkPermissions() : Promise<any> {
    //Check MOBILE permissions
    return await new Promise(async (resolve, reject) => 
    {
      console.log('checking permissions');

      const hasPermission = await this.checkGPSPermission();
      if (hasPermission) {
          if( Capacitor.isPluginAvailable('Geolocation') ) {
              const canUseGPS = await this.askToTurnOnGPS();
              //this.postGPSPermission(canUseGPS);
          } else {
            console.log('Plugin NOT available');
            //this.postGPSPermission(true);
          }
          resolve(true);
      } else {
        console.log('Doesnt have permissions');

        //@capacitor/geolocation for mobile
        Geolocation.requestPermissions()
          .then(async permission => {
            console.log(permission);
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
      }

    });

  }

  // Check if application has GPS access permission
  async checkGPSPermission() : Promise<Boolean> {
  return await new Promise( (resolve, reject) => {
    console.log('check gps permission');
      if(this.isMobile) {
        
        reject(false);
      } else {
        resolve(true);
      }

    });
  }

  // Ask user to turn on position
  async askToTurnOnGPS(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      console.log('askToTurnOnGps');
        LocationAccuracy.canRequest()
        .then((canRequest: boolean) => {
            if (canRequest) {
                // the accuracy option will be ignored by iOS
                LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                .then((res) => {
                  console.log('Request successful'),
                  resolve(true);
                })
                .catch((err) =>  {
                  console.log('Error requesting location permissions', err)
                  reject(false)  ;
                });
                
            } else { reject(false);  }
        });
    })
  }

  postGPSPermission = async (canUseGPS: boolean) => {
    if (canUseGPS) {
        //this.watchPosition();
        console.log('Position enabled by user');
        
    }
    else {
        await Toast.show({
            text: 'Please turn on GPS to get location'
        })
    }
  }

  watchPosition = async () => {
    //getting actual position and saving it
    try {
        this.state.loading = true;

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
              //this.clearWatch();
            }})
            
    } catch (err) { console.log('err', err) }
  }

  // Location API requests
  async getAddressInfo(latlng: any) : Promise<any> {

    return new Promise(  (resolve, reject) => {
      let address;
      
      //this.streetObserv = this.getRequest(`${this.reversegeocodeurl}?apikey=${this.KEY}&lat=${latlng.lat}&lon=${latlng.lng}`);
      //country, region, postcode, district, place, locality, neighborhood, address, and poi
      const types = 'district';
      //revgeocode.search.hereapi.com/v1/revgeocode?at=${latlng.lat},${this.latlng.lng}&lang=en-US&apiKey=${this.KEY}
      this.streetObserv = this.getRequest(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latlng.lat}%2C${latlng.lng}&lang=en-US&apiKey=${this.KEY}`);
      this.streetObserv
        .subscribe(res => {
          if(!res?.items[0]){ 
            reject(null); 
          } else {

            console.log('response: ', res.items[0]);
            this.streetData = res.items[0];
            const road = this.streetData['address']['label'] != undefined ? this.streetData['address']['label'] : null;
            const county = this.streetData['address']['county'] != undefined ? this.streetData['address']['county'] : null;
            const state = this.streetData['address']['state'] != undefined ? this.streetData['address']['state'] : null;
            //save info if not null
            let fullAddress;
            let fullAddressNotEmpty = [ road, county, state ].filter(function (val) {return val;}).join(', ');
            fullAddress = fullAddressNotEmpty
            console.log("fullAddress: " +fullAddress);
            //Address Info
            this.locationData.addressInfo.full_address = fullAddress;
            this.locationData.addressInfo.road = road;
            this.locationData.addressInfo.state = state;
            this.locationData.addressInfo.country = county;
            
            this.staticMapImageUrl = this.getMapImage(latlng.lat,latlng.lng, 20);
            this.locationData.staticMapImageUrl = this.staticMapImageUrl;
            console.log(this.staticMapImageUrl);
            
            address = this.locationData;
            resolve(address);

          }
          
        },err => {
          console.log(err);
          
        }
        )
        
    });

  }

  private getMapImage(lat: number, lng: number, zoom: number = 15.25) {
    const staticMapKey = 'VAoFjQOKPlpfD9WAbLgg4kYC3YBVSt8811TxV6hf2Pg'
    //xFxSX20K-2HftLNcqHdmh_a-gh209fOHIZGqqEBWxkenDTslII3JKlbPvQYI9o_rjfW9CPhtvo2JJBTTLrErgw
    const mapboxtoken = 'pk.eyJ1Ijoidm1tYXBkZXZlbG9wZXIiLCJhIjoiY2w0bXQ2bzdyMGZzNDNjbnM2YTllaDVlbyJ9.KJMSxBbt482Bs-1ihJZoVg';
    const user = 'mapbox';
    const style = 'streets-v11';
    const bearing = 0;
    const pitch = 60;
    const width = 400;
    const height = 400;
    //{overlay}/{lon},{lat},{zoom},{bearing},{pitch}|{bbox}|{auto}/{width}x{height}{@2x}
    //example -122.4241,37.78 ,15.25,0,60
    //return `${this.staticimageurl}/${user}/${style}/static/${lat},${lng},${zoom},${bearing},${pitch}/${width}x${height}/?access_token=${mapboxtoken}`;
    return `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=en-US&apiKey=${staticMapKey}`
  }

  // address
  pretifyAddress(address){
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      data += obj[val]+', ';
    }
    return address.slice(0, -2);
  }

  getRequest(url) {
    if (isPlatform('capacitor')){
      return from(Http.request({
        method: 'GET',
        url,
        /* headers: { 
        'Access-Control-Allow-Origin': '*',  
        'Access-Control-Allow-Methods':'GET',  
        'Access-Control-Allow-Headers':'application/json'
        }, */
      })
      ).pipe(
        map(result => result.data)
      );
    } else {
      return this.httpClient.get(`${url}`);
    }
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
