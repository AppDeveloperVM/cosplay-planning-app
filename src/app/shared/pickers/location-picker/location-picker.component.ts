import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation, Coordinates } from '../../../models/location.model';
import { Observable, of } from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { MapModalLeafletComponent } from '../../map-modal-leaflet/map-modal-leaflet.component';
import * as L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";

import { AddressData } from '../../../models/addressData.model';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  apiKey: 'AAPK80e3c05f540941038fc676d952b3d4dd4LfYwSmZOK8R8eaHkGd7zA3abSxbnaIUouru38-9EVrOyakBSsQ40oyMiuRcSrEw';
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  @Input() multiple = false;
  @Input() getCurrentLocation = true;
  @Input() selectedLocationImage: string;
  @Input() center = {};
  streetObserv: Observable<any>;
  streetData: any;

  //watchId: CallbackID = '';
  state: any;
  isLoading = false;

  constructor(
      private modalCtrl: ModalController,
      private httpClient: HttpClient,
      private actionSheetCtrl: ActionSheetController,
      private alertCtrl: AlertController,
      private location: LocationService,
      private platform: Platform
    ) { }

  ngOnInit() {
    if(this.getCurrentLocation){
      this.platform.ready().then(() => {
        //let permissions = this.location.checkPermissions();
        //if(permissions)
        this.getCurrentCoords();
      });
    }
    
  }

  private async locateUser() {
    /*if (!Capacitor.isPluginAvailable('Geolocation')) {
      
      this.showErrorAlert();
      return;
    }*/
    this.isLoading = true;
    await Geolocation.getCurrentPosition().
    then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.center = coordinates;
      
      this.createPlace(coordinates);
      this.isLoading = false;
    }).
    catch(err => {
      this.isLoading = false;
      this.showErrorAlert();
    });
  }

  

  onPickLocation() {
    
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

  private getCurrentCoords(){ 
    /*if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }*/
    this.isLoading = true;
    Geolocation.getCurrentPosition().
      then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.center = coordinates;
        
        console.log('Coords Obtained: '+coordinates.lat+', '+coordinates.lng);
        //this.createPlace(new L.LatLng(coordinates.lat, coordinates.lng));
        this.isLoading = false;
      }).
      catch(err => {
        this.isLoading = false;
        this.showErrorAlert();
        //this.location.requestGPSPermission();  
        
        this.openLocationPopover();
      });
  }

  private openLocationPopover(){

  }

  private showErrorAlert(error: string = 'Please use the map to pick location') {
    this.alertCtrl.create({
      header: 'Could not get location, try selecting it',
      message: error,
      buttons : [ 'Okay']
    }).then(alertEl => alertEl.present() );
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
        modalEl.onDidDismiss().then(modalData => {
          console.log("data returned  :"+modalData.data[0]);
          if (!modalData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data[0].lat,
            lng: modalData.data[0].lng
          };
          
          this.createPlace(modalData.data[0]);
        });
        modalEl.present();
      });
  }

  private createPlace(latlng: any) {
    console.log("coords: lat:"+latlng.lat+", lng: "+latlng.lng);

    const pickedLocation: PlaceLocation = {
      lat: latlng.lat,
      lng: latlng.lng,
      address: null,
      staticMapImageUrl: null
    };
    const addressInfo : AddressData = {
      full_address: null,
      road: null,
      country: null,
      state: null,
      postal_code: null
    }

    this.isLoading = true;
    
    //OpenMapQuest key and url
    var KEY = 'hmAnp6GU6CtArMcnLn38nJS0Sb1orh9Q';
    const reversegeocodeurl = `https://open.mapquestapi.com/nominatim/v1/reverse.php?key=${KEY}&format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
 
    this.streetObserv = this.httpClient.get(reversegeocodeurl);
    this.streetObserv
    .subscribe(data => {
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
      addressInfo.full_address = fullAddress;
      addressInfo.road = road;
      addressInfo.state = state;
      addressInfo.country = county;
      pickedLocation.address = addressInfo;

      const staticMapImageUrl = this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.isLoading = false;

      this.locationPick.emit(pickedLocation);
      console.log("updated selectedLocationImage");
    });

  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    var KEY = 'hmAnp6GU6CtArMcnLn38nJS0Sb1orh9Q';
    return `https://open.mapquestapi.com/staticmap/v4/getplacemap?key=${KEY}&location=${lat},${lng}&size=600,400&zoom=9&showicon=red_1-1`;
  }
}
