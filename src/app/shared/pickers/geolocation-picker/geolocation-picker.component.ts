import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';
import { ActionSheetController, AlertController, isPlatform, ModalController, Platform, PopoverController } from '@ionic/angular';
import { from, Observable } from 'rxjs';

import { LocationService } from 'app/services/location.service';
import { Geolocation } from '@capacitor/geolocation';
import { Coordinates, PlaceLocation } from 'app/models/location.model';
import { BrowserGeolocationService } from '../../../services/browser-geolocation.service';
import { MapModalLeafletComponent } from 'app/shared/map-modal-leaflet/map-modal-leaflet.component';
import { AddressData } from 'app/models/addressData.model';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { PopoverComponent } from 'app/components/popover/popover.component';
import { map } from 'rxjs/operators';
import { GeolocationService } from 'app/services/geolocation.service';



@Component({
  selector: 'app-geolocation-picker',
  templateUrl: './geolocation-picker.component.html',
  styleUrls: ['./geolocation-picker.component.scss'],
})
export class GeolocationPickerComponent implements OnInit {
  @Input() showPreview = false;
  @Input() multiple = false;
  @Input() getCurrentLocation = true;
  @Input() selectedLocationImage: string = '';
  @Input() center = {lat : 40.416729, lng: -3.703339};
  @Output() locationPick = new EventEmitter<PlaceLocation>();

  //-- Location data --
  apiKey: 'AAPK80e3c05f540941038fc676d952b3d4dd4LfYwSmZOK8R8eaHkGd7zA3abSxbnaIUouru38-9EVrOyakBSsQ40oyMiuRcSrEw';
  loc = "";
  latitude = null;
  longitude = null;
  actualLocation = null;

  streetObserv: Observable<any>;
  streetData: any;
 
  isLoading = false;
  isMobile = Capacitor.getPlatform() !== 'web'; 
  

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private popoverCtrl : PopoverController,
    private actionSheetCtrl: ActionSheetController,

    private browserLocation : BrowserGeolocationService,
    private geolocationService: GeolocationService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.platform.ready().then( () => {
      if(this.isMobile){
        //Check permissions and request them
        this.geolocationService.checkPermissions()
        .then((res) => {
          //Got permission
          console.log(res);
          this.getCurrentCoords();
        })
        .catch((err)=> {
          console.log(err);
          //Need to enable location
          this.openLocationPopover();
        })
      } else {
        //Browser
        this.browserLocation.requestGeolocationPermission()
        .then((location)=> {
          console.log(location);
          this.actualLocation = location;
          this.center = location;
        })
        .catch((err)=> {
          console.log(err);
        })
      }
    });
  }

  private async openLocationPopover(){
    
    try {
        const popover = await this.popoverCtrl.create({
          component : PopoverComponent,
          cssClass: 'custom-popover',
          translucent: true
        });

        await popover.present();
        const { data } = await popover.onDidDismiss();
        console.log('onDidDismiss with data,' + data);

        if(data) {
          this.requestGeolocationPermission();
        } else {
          this.loc = "Example 1";
        }

      }catch(err){
        console.log(err);
        
      }
  }

  onPickLocation() {
    console.log('OnPickLocation');

    this.actionSheetCtrl.create({header: 'Please Choose', buttons: [
      {text: 'Auto-Locate', handler: () => {
        this.locateUser();
      }},
      {text: 'Pick on Map', handler: () => {
        this.openMap();
      }},
      {text: 'Cancel', role: 'cancel'}
    ]}).then(actionSheetCtrl => {
      actionSheetCtrl.present();
    }); 
  } 

  private async locateUser() {
    this.isLoading = true;

    await Geolocation.getCurrentPosition().
    then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.center = coordinates;
      console.log(coordinates);
      
      this.createPlace(coordinates);
      this.isLoading = false;
    }).
    catch(err => {
      this.isLoading = false;
      this.showErrorAlert(err);
      //this.openMap();
    });
  } 

  private getCurrentCoords(){ 
    this.isLoading = true;

    Geolocation.getCurrentPosition().
      then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.center = coordinates;
        
        console.log('Coords Obtained: '+coordinates.lat+', '+coordinates.lng);
        this.createPlace(new L.LatLng(coordinates.lat, coordinates.lng));
        this.isLoading = false;
      }).
      catch(err => {
        console.log(err);
        
        this.isLoading = false;
        this.showErrorAlert();
        //this.location.requestGPSPermission();  
        
        this.openLocationPopover();
      });
  } 

  async requestGeolocationPermission() {
    
    if(this.isMobile){
      //Mobile

    } else {
      //Browser

       this.browserLocation.requestGeolocationPermission()
      .then( (location) => {
        this.actualLocation = location;
      })
      .catch( (error) => {
        console.log('Error requesting Browser Location :' + error);
      })
    } 

 
    /* const permission = await Geolocation.requestPermissions()
    .then( (res) => {
      console.log(res);
      
    })
    .catch((err)=>{
      console.log(err);
      
    }) */

}

  private openMap() {
    this.modalCtrl.create(
      {
        component: MapModalLeafletComponent,
        componentProps: {
          center: this.center,
          //markers: this.placesData , // array of markers
          selectable: true,
          multiple: this.multiple,
          closeButtonText: 'cerrar',
          //title: this.planning.title
        } 
      }).then(
      modalEl => {
        modalEl.onDidDismiss()
        .then(modalData => {
          console.log("data returned  :",modalData);

          /* if (!modalData.data) {
            return;
          } */
          

          if(modalData != null){
            var coordinates: Coordinates = {
              lat: modalData.data.lat,
              lng: modalData.data.lng
            };
            this.center = coordinates;
            
            if(coordinates ! = null)
            this.createPlace(coordinates);
          }
          
        });
        modalEl.present();
      })
      .catch((err)=> {
        console.log(err);
        
      })
  }

  private createPlace(latlng: any) {
    console.log("coords: lat:"+latlng.lat+", lng: "+latlng.lng);

    var pickedLocation: PlaceLocation = {
      lat: latlng.lat,
      lng: latlng.lng,
      address: null,
      staticMapImageUrl: null
    };
    var addressInfo : AddressData = {
      full_address: null,
      road: null,
      country: null,
      state: null,
      postal_code: null
    }

    this.isLoading = true;

    this.geolocationService.getAddressInfo(latlng)
    .then((res)=> {
      //returns address info ( fullAddress, road, state, country, staticMapImageUrl )
      console.log('AddresData returned: ' , res);
      
      pickedLocation.address = res.addressInfo;
      pickedLocation.staticMapImageUrl = res.staticMapImageUrl;
      addressInfo = res;

      this.selectedLocationImage = res.staticMapImageUrl;

      this.isLoading = false;
      this.locationPick.emit(pickedLocation.address);
    })

    
    

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

  private showErrorAlert(error: string = 'Please use the map to pick location') {
    this.alertCtrl.create({
      header: 'Error',
      message: 'Could not get location, try selecting it, or enable Location',
      buttons : [ 'Okay']
    })
    .then(alertEl => alertEl.present() )
    .catch((err)=> {
      console.log(err);
    })
  }

}
