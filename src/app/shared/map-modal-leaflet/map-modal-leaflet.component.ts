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

@Component({
  selector: 'app-map-modal-leaflet',
  templateUrl: './map-modal-leaflet.component.html',
  styleUrls: ['./map-modal-leaflet.component.scss'],
})
export class MapModalLeafletComponent implements OnInit, OnDestroy {

  map: Leaflet.Map;
  apiKey = "AAPK80e3c05f540941038fc676d952b3d4dd4LfYwSmZOK8R8eaHkGd7zA3abSxbnaIUouru38-9EVrOyakBSsQ40oyMiuRcSrEw";
  basemapEnum = "ArcGIS:Streets";

  directions;
  startLayerGroup;
  endLayerGroup;
  routeLines;
  currentStep;
  startCoords;
  endCoords;
  arcgisRest;

  @Input() center ; // initial route point
  @Input() markers = []; // array of markers given
  @Input() selectable; // = true;
  @Input() multiple = false;

  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';

  constructor(
    private modalCtrl: ModalController,
    private placeDataService: PlaceDataService
  ) { }

  ngOnInit() {
    //Getting markers data from JSON file
    this.fetchPlacesData()
  }
  ionViewDidEnter() { this.leafletMap(); }


  leafletMap() {
    // Creating map options
    var mapOptions = {
      center: this.center,
      zoom: 10
    }

    this.map = new L.Map('mapId', mapOptions);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    /*
    vector.vectorTileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      apiKey: this.apiKey
    }).addTo(this.map);
    */

    //Custom icon
    var customIcon = L.icon({
      iconUrl: 'marker-icon.png',
      iconSize:     [25, 40], // size of the icon
    });

    // Options for the marker
    var markerOptions = {
      title: "MyLocation",
      clickable: false,
      draggable: false,
      icon: customIcon
    }

    var outerThis = this;
    //add multiple markers
   
    
    for (let marker of this.markers) {
      console.log( marker['lat'] );
        let markPoint = L.marker( { lat: marker['lat'], lng: marker['long'] } , markerOptions );
        markPoint.bindPopup(marker['name']);
        markPoint.addTo(outerThis.map);
    }

    /*
    this.startCoords = [{'lat': 41.390205, 'long': 2.154007}];
    this.endCoords = [{'lat': 41.56667, 'long': 2.01667 }];
    this.createRoute();
    this.updateRoute();
    */

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

  fetchPlacesData() { // fetch places from json
    fetch('../../assets/data/places_1.json').then(res => res.json()) // json file depends on planning id
      .then(data => {
        this.markers = data.places;
        this.placeDataService.setPlaces(this.markers);
      });
  }
  
  onCancel() {
    this.modalCtrl.dismiss();
    // volver a crear la imagen del mapa
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

}
