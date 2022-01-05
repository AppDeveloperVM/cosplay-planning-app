import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MapModalLeafletComponent } from '../../map-modal-leaflet/map-modal-leaflet.component';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation, Coordinates } from '../../../main/cosplays/cosplay-groups/location.model';
import { Observable, of } from 'rxjs';
import { Plugins, Capacitor } from '@capacitor/core';
import * as L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";

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
  @Input() selectedLocationImage: string;
  @Input() center = {};
  streetObserv: Observable<any>;
  streetData: any;

  isLoading = false;

  constructor(
      private modalCtrl: ModalController,
      private httpClient: HttpClient,
      private actionSheetCtrl: ActionSheetController,
      private alertCtrl: AlertController,
    ) { }

  ngOnInit() {
    this.getCurrentCoords();
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

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition().
    then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.center = coordinates;
      
      this.createPlace([coordinates.lat, coordinates.lng]);
      this.isLoading = false;
    }).
    catch(err => {
      this.isLoading = false;
      this.showErrorAlert();
    });
  }


  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick location',
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
    console.log("coords: lat:"+latlng.lat+"lng: "+latlng.lng);

    const pickedLocation: PlaceLocation = {
      lat: latlng.lat,
      lng: latlng.lng,
      address: null,
      staticMapImageUrl: null
    };

    this.isLoading = true;

    let addressData;
    var KEY = 'hmAnp6GU6CtArMcnLn38nJS0Sb1orh9Q';
    const reversegeocodeurl = `http://open.mapquestapi.com/nominatim/v1/reverse.php?key=${KEY}&format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
 
    this.streetObserv = this.httpClient.get(reversegeocodeurl);
    this.streetObserv
    .subscribe(data => {
      console.log('my data: ', data);
      this.streetData = data;
      const road = this.streetData['address']['road'] != undefined ? this.streetData['address']['road'] : '-';
      const county = this.streetData['address']['county'] != undefined ? this.streetData['address']['county'] : '-';
      const state = this.streetData['address']['state'] != undefined ? this.streetData['address']['state'] : '-';
      addressData = road + " , " + county + " , " +state;
      console.log(addressData);
      pickedLocation.address = addressData;
    });

    const staticMapImageUrl = this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
    pickedLocation.staticMapImageUrl = staticMapImageUrl;
    this.selectedLocationImage = staticMapImageUrl;
    this.isLoading = false;
    this.locationPick.emit(pickedLocation);
    console.log("updated selectedLocationImage");
  }

  private getCurrentCoords(){
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition().
    then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.center = coordinates;
      
      console.log('Coords Obtained');
      this.isLoading = false;
    }).
    catch(err => {
      this.isLoading = false;
      this.showErrorAlert();
    });
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    var KEY = 'hmAnp6GU6CtArMcnLn38nJS0Sb1orh9Q';
    var token = 'NABNHp_s69NxKe4t1UDV3t3pACLyRh1jIUQvdMcRjWuCCZkFsk-IPT8ZAgnSh_a109v7rx_StyCfxtfsssItDLQqVYJoS-g77lqicFAi2rQ61lckUfKEd01jC4m6ChlGNlmA4EhtLIsWE984eXiwiw';
  
    return `https://open.mapquestapi.com/staticmap/v4/getplacemap?key=${KEY}&location=${lat},${lng}&size=600,400&zoom=9&showicon=red_1-1`;
  }
}
