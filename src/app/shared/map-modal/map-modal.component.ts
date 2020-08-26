import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { PlaceDataService } from 'src/app/services/place-data.service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  placesData = [];
  @Input() center = { lat: 39.5695818, lng: 2.6500745 }; // initial route point
  @Input() markers = []; // array of markers given
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickListener: any;
  googleMaps: any;
  map: any;


  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private placeDataService: PlaceDataService
  ) { }

  ngOnInit() {
    this.placesData = this.placeDataService.getPlaces();
  }

  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      this.getGoogleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: this.center, // center of the view
        zoom: 16,
      });

      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      // hay que modificar cómo se obtienen los marcadores y
      // se añaden al mapa
      if (this.selectable) {
        this.clickListener = map.addListener('click', event => {
          const selectedCoords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          this.modalCtrl.dismiss(selectedCoords);
        });
      } else {
        // Obtener mapa y markers a mostrar
        this.getMarkers(googleMaps, map);

        /*const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: this.title
        });
        marker.setMap(map);*/
      }

    }).catch( err => {
      console.log(err);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  getMarkers(googleMaps, map) {
    // tslint:disable-next-line:variable-name
    for (let _i = 0; _i < this.placesData.length; _i++) {
      // if (_i > 0) {
        this.addMarkersToMap(googleMaps, map, this.placesData[_i]);
      // }
    }
  }

  addMarkersToMap(googleMaps, map, place) {
    // const position = new googleMaps.LatLng(museum.latitude, museum.longitude);
    const myLatlng = new googleMaps.LatLng( parseFloat(place.latitude), parseFloat(place.longitude));
    const placeMarker = new googleMaps.Marker({
      position: myLatlng,
      map,
      title: place.name
     });

    const content = '<h4 style="color:black">' + place.name + '</h4>';

    this.addInfoWindow(placeMarker, content);

    placeMarker.setMap(map);
  }


  addInfoWindow(marker, content){

    const infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  private getGoogleMaps(): Promise<any> {
    const win =  window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject(' Google maps sdk not available.. ');
        }
      };
    });
  }

}
