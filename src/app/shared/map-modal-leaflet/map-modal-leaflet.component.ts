import { Component, OnInit, OnDestroy, Input  } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
// Leaflet
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import 'leaflet/dist/leaflet.css';
import * as L from "leaflet";

@Component({
  selector: 'app-map-modal-leaflet',
  templateUrl: './map-modal-leaflet.component.html',
  styleUrls: ['./map-modal-leaflet.component.scss'],
})
export class MapModalLeafletComponent implements OnInit, OnDestroy {
  map: Leaflet.Map;

  @Input() center ; // initial route point
  @Input() markers = []; // array of markers given
  @Input() selectable; // = true;
  @Input() multiple = false;

  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const coords = [
      {'lat': 41.390205, 'long': 2.154007 , 'name': 'Marker A'},
      {'lat': 41.56667, 'long': 2.01667 , 'name': 'Marker B'}
    ];
    this.markers = coords;
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

    // Custom icon options
    const iconOptions = {
      iconUrl: 'marker-icon.png',
      iconSize:     [25, 40], // size of the icon
    };

    //Custom icon
    var customIcon = L.icon(iconOptions);

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
