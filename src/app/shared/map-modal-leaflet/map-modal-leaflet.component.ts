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
  @Input() markers; // = []; // array of markers given
  @Input() selectable; // = true;
  @Input() multiple = false;

  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {}
  ionViewDidEnter() { this.leafletMap(); }


  leafletMap() {
    // Creating map options
    var mapOptions = {
      center: [-33.8688, 151.2093],
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

    const markPoint = L.marker([-33.8688, 151.2093], markerOptions);
    markPoint.bindPopup('<p>Tashi Delek - Bangalore.</p>').openPopup();
    markPoint.addTo(this.map);
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
