import { Component, OnInit, OnDestroy, Input  } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';

// Leaflet
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import 'leaflet/dist/leaflet.css';
import * as L from "leaflet";
import * as vector from 'esri-leaflet-vector';
import { ApiKey } from '@esri/arcgis-rest-auth';
import {
  solveRoute,
} from "@esri/arcgis-rest-routing";
import { PlaceDataService } from 'src/app/services/place-data.service';
import { PlanningService } from 'src/app/services/planning.service';
import { CosplaysService } from 'src/app/services/cosplays.service';
import { CosplayGroupService } from 'src/app/services/cosplay-group.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-map-modal-leaflet',
  templateUrl: './map-modal-leaflet.component.html',
  styleUrls: ['./map-modal-leaflet.component.scss'],
})
export class MapModalLeafletComponent implements OnInit, OnDestroy {

  map: Leaflet.Map;
  apiKey = "AAPK80e3c05f540941038fc676d952b3d4dd4LfYwSmZOK8R8eaHkGd7zA3abSxbnaIUouru38-9EVrOyakBSsQ40oyMiuRcSrEw";
  basemapEnum = "ArcGIS:Streets";

  @Input() item;
  @Input() itemType;
  @Input() center ; // initial route point
  @Input() markers = []; // array of markers given
  @Input() selectable; // = true;
  @Input() multiple = false;

  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickTriggersNewPlace = false;
  clickListener: any;

  directions;
  startLayerGroup;
  endLayerGroup;
  routeLines;
  currentStep;
  startCoords;
  endCoords;
  arcgisRest;

  customIcon;
  MarkerOptions;
  markerLayer;
  centerLatLng = [];

  

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private placeDataService: PlaceDataService,
    private locationService: LocationService,
    private planningService:PlanningService,
    private cosplayGroupService:CosplayGroupService){ }

  ngOnInit() {
  }
  
  ionViewDidEnter() { this.leafletMap(); }


  leafletMap() {
    // Creating map options
    var mapOptions = {
      center: this.center,
      zoom: 10
    }

    this.map = new L.Map('mapId', mapOptions);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    //Custom icon
    var customIcon = L.icon({
      iconUrl: 'marker-icon.png',
      shadowUrl: 'marker-icon.png',
      iconSize:     [25, 40], // size of the icon
      shadowSize:   [25, 40],
      iconAnchor: [15, 51], // point of the icon which will correspond to marker's location
      popupAnchor: [-2 ,-51] // point from which the popup should open relative to the iconAnchor                                 

    });
    this.customIcon = customIcon;

    // Options for the marker
    var markerOptions = {
      title: "MyLocation",
      clickable: false,
      draggable: false,
      icon: customIcon
    }
    this.MarkerOptions = markerOptions;

    var outerThis = this;
    //add multiple markers
   console.log('markers:',this.markers);

   if(this.markers.length > 0){
    this.markers.forEach((value,index)=> {
      var marker = value;
        console.log("marker: ", marker );
        const name = marker.name!= undefined ? marker.name : '';
        const address = marker.address!= undefined ? marker.address.full_address : null;
        const popupContent = `<p style='text-align:center;'><b>${name}</b><br/>${address}</p>`
        markerOptions.title = `${name}`;

        let markPoint = L.marker( { lat: marker['lat'], lng: marker['lng'] } , markerOptions );
        markPoint.bindPopup(popupContent);
        markPoint.addTo(outerThis.map).on('click', this.onMarkerClick);
    });
   }

    if(this.selectable){
      //Enable Map OnClick
      this.map.on('click', this.onMapClick, this);
      //Enable options menu ( buttons )
    }

    /*
    this.startCoords = [{'lat': 41.390205, 'long': 2.154007}];
    this.endCoords = [{'lat': 41.56667, 'long': 2.01667 }];
    this.createRoute();
    this.updateRoute();
    */

  }

  onMapClick(e) {
    var outerThis = this;
    if(this.clickTriggersNewPlace != true) return;
    this.clickTriggersNewPlace = false;

    //Multiple markers?
    if(this.multiple == false && this.markerLayer != null){
      this.markerLayer.clearLayers();
    }
    this.markerLayer = L.layerGroup().addTo(this.map);
    
    const alert = this.alertCtrl.create({
      header: 'New Place',
      message: 'Enter a name for the place :',
      inputs: [
        {
          name: 'name',
          placeholder: 'Location name'
        }
      ],
      buttons: [ 
        {
          text: 'Add',
          handler: data => {
            this.newMarker(e, data)
            this.clickTriggersNewPlace = true;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Enable the map again
            // map.setClickable(true);
            this.clickTriggersNewPlace = true;
          }
      }
      ]
    }).then(alertEl => {
      alertEl.present().then(() => {
        const firstInput: any = document.querySelector('ion-alert input');
        firstInput.focus();
        return;
      });
    });
  }

  newMarker(e,data){
    let markerLatLng = { lat: e.latlng.lat, lng:e.latlng.lng };
    //outerThis.MarkerOptions
    let markPoint = L.marker( markerLatLng , this.MarkerOptions );
    let name = data.name;
    let first = name.substr(0,1).toUpperCase();
    let marker_name = first +  name.substr(1);
    markPoint.bindPopup(marker_name)
    markPoint.addTo(this.markerLayer);
    markPoint.openPopup();

    // new Marker Object
    const PlaceData = [
      {
        name : data.name,
        state : 'Spain', // se deberia obtener, no hardcodear
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }
    ];

    let address_info;
    this.locationService.setLocationCoords(e.latlng.lat,e.latlng.lng)
    this.locationService.getAddressInfo().then((data) =>
    {
      address_info = data;
      const MarkerData = 
      {
        name: marker_name,
        address : {
          full_address : address_info.full_address
        },
        state : 'Spain', // se deberia obtener, no hardcodear
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      this.markers.push(MarkerData); 
      this.updateMarkers();
      this.centerLatLng.push(e.latlng);
      console.log(this.markers);
      console.log(e.latlng);

      this.placeDataService.setPlace(MarkerData);
      this.showToast('Lugar añadido!');

    });
    
  }

  onMarkerClick(e){
    //this.map.flyTo(e.latlng);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  updateMarkers(){
    console.log(this.item);

    
    if( this.itemType == 'planning' ){
      this.item.places = this.markers;

      const planning = this.item;
      const planningId = planning?.id || null;
      this.planningService.onSavePlanning(planning, planningId).then(
        (data) => {
          this.showToast('Markers updated:'+ data);
        },
        (err) =>{
          this.showToast(err);
        }
      );
    } else if( this.itemType == 'cosGroup'){
      const cosGroup = this.item;
      const cosGroupId = cosGroup?.id || null;
      this.cosplayGroupService.onSaveCosGroup(cosGroup, cosGroupId).then(
        (data) => {
          this.showToast('Markers updated:'+ data);
        },
        (err) =>{
          this.showToast(err);
        }
      );
    }


  }

  enableClickListener(){
    this.clickTriggersNewPlace = !this.clickTriggersNewPlace;
    console.log(this.clickTriggersNewPlace);
  }

  defineRoute(){

  }

  createRoute(){
    // Add a DOM Node to display the text routing directions
    this.directions = document.createElement("div");
    this.directions.id = "directions";
    this.directions.innerHTML = "Click on the map to create a start and end for the route.";
    document.body.appendChild(this.directions);
    // Layer Group for start/end-points
    this.startLayerGroup = L.layerGroup().addTo(this.map);
    this.endLayerGroup = L.layerGroup().addTo(this.map);

    // Layer Group for route lines
    this.routeLines = L.layerGroup().addTo(this.map);
    this.currentStep = "start";
  }

  updateRoute() {
    // Create the arcgis-rest-js authentication object to use later.
    const authentication = new ApiKey({
      key: this.apiKey
    });

    // make the API request
    solveRoute({
      stops: 
        [
          this.startCoords,
          this.endCoords
        ],
      endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",
      authentication
    })
    .then((response) => {
      // Show the result route on the map.
      this.routeLines.clearLayers();
      L.geoJSON().addTo(this.routeLines);

      // Show the result text directions on the map.
      const directionsHTML = response.directions[0].features.map((f) => f.attributes.text).join("<br/>");
      this.directions.innerHTML = directionsHTML;
      this.startCoords = null;
      this.endCoords = null;
    })
    .catch((error) => {
      console.error(error);
      //alert("There was a problem using the route service. See the console for details.");
    });
  }
  
  onCancel() {
    if(this.multiple){
      this.modalCtrl.dismiss(this.markers);
    }else{
      this.modalCtrl.dismiss(this.centerLatLng);
    }
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

}
