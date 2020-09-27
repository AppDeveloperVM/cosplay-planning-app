import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
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
  @Input() multiple = false;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickListener: any;
  googleMaps: any;
  map: any;


  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private renderer: Renderer2,
    private placeDataService: PlaceDataService
  ) { }

  ngOnInit() {
    this.placesData = this.placeDataService.getPlaces();
  }

  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      this.getGoogleMaps = googleMaps;
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: this.center, // center of the view
        zoom: 16,
      });

      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      // get actual markers
      this.getMarkers(googleMaps, map);

      // hay que modificar cómo se obtienen los marcadores y
      // se añaden al mapa
      if (this.selectable) {
        if (this.multiple) {
          this.clickListener = map.addListener('click', event => {

            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            // centrar cámara en la nueva posición ( con animacion )
            map.panTo(selectedCoords); //
            // -- drawing manager with options --
            // añadir marcador en esta ubicacion..
            // la idea es montar un formulario para nombrar el marcador nuevo..

            // map.setClickable(false);

            const alert = this.alertCtrl.create({
              header: 'New Place',
              message: 'Choose a name :',
              inputs: [
                {
                  name: 'name',
                  placeholder: 'Name'
                }
              ],
              buttons: [
                {
                  text: 'Add',
                  handler: data => {
                  // show new marker

                    // new googleMaps Marker object
                    const newPlace = new this.googleMaps.Marker({
                      position: selectedCoords,
                      map,
                      title: data.name
                    });
                    this.addMarkerToMap(googleMaps, map, newPlace);

                    // new Marker Object
                    const PlaceData = [
                      {
                        name : data.name,
                        state : 'Spain',
                        latitude: selectedCoords.lat,
                        longitude: selectedCoords.lng
                      }
                    ];
                    this.placeDataService.setPlace(PlaceData);
                    this.markers.push(PlaceData[0]);

                    this.getMarkers(googleMaps, map);
                    console.log(this.markers);
                    map.setZoom(map.getZoom()); // used to reload the map
                  }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {

                        // Enable the map again
                        // map.setClickable(true);

                    }
                }
              ]
            })
            .then(alertEl => {
              alertEl.present().then(() => {
                const firstInput: any = document.querySelector('ion-alert input');
                firstInput.focus();
                return;
              });
            });

            // this.modalCtrl.dismiss(selectedCoords);
          });
          console.log(this.markers);
        } else {
          this.clickListener = map.addListener('click', event => {
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            this.modalCtrl.dismiss(selectedCoords);
          });
        }
      } else {
        // Obtener mapa y markers a mostrar
        this.getMarkers(googleMaps, map);

        // Get actual location - with a button
        // map.setMyLocationEnabled(true);
        // map.getUiSettings().setMyLocationButtonEnabled(true);
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

  updatePlacesData() {
    this.placesData = this.placeDataService.getPlaces();
  }

  /* reloadMarkers() {
    for (let _i = 0; _i < this.markers.length; _i++) {
      // if (_i > 0) {
        const place = this.markers[_i];
        const Coords = {
          lat: place.latLng.lat(),
          lng: place.latLng.lng()
        };
        const placeMarker = new this.googleMaps.Marker({
          position: Coords,
          map : this.map,
          title: place.name
        });
        place.setMap(null);
      // }
    }

    this.markers = [];

    this.setMarkers( this.placeDataService.getPlaces() );
  }
  */

  getMarkers(googleMaps, map) {
    // tslint:disable-next-line:variable-name
    for (let _i = 0; _i < this.placesData.length; _i++) {
      // if (_i > 0) {
        this.addMarkerToMap(googleMaps, map, this.placesData[_i]);
      // }
    }
  }

  addMarkerToMap(googleMaps, map, place) {
    // const position = new googleMaps.LatLng(museum.latitude, museum.longitude);
    const myLatlng = new googleMaps.LatLng( parseFloat(place.latitude), parseFloat(place.longitude));
    const placeMarker = new googleMaps.Marker({
      position: myLatlng,
      map,
      title: place.name
    });

    const content = '<div id="iw-container"><div class="iw-title" style="color:black;font-size:22px;text-transform:capitalize;">' + place.name + '</div></div>';

    this.addInfoWindow(googleMaps, placeMarker, content);

    placeMarker.setMap(map);
    this.placeDataService.setPlace(placeMarker);
  }

  setMarkers(places) {

    for (let _i = 0; _i < places.length; _i++) {
      const place = places[_i];

      const myLatLng = new this.googleMaps.LatLng(place[1], place[2]);
      const marker = new this.googleMaps.Marker({
          position: myLatLng,
          map: this.map,
          animation: this.googleMaps.Animation.DROP,
          title: place[0],
          zIndex: place[3]
      });

      // Push marker to markers array
      this.markers.push(marker);
    }

  }


  addInfoWindow(googleMaps, marker, content) {

    const infoWindow = new googleMaps.InfoWindow({
      content
    });

    googleMaps.event.addListener(marker, 'click', () => {
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
