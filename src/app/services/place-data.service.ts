import { Injectable } from '@angular/core';
import { Place } from '../pages/main/planning/place.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceDataService {
  places: [];
  place: Place;
  placesUpdated: any;

  constructor() { }

  setPlaces(data) {
    this.places = data;
  }

  getPlaces() {
    return this.places;
  }

  getPlacesUpdateListener() {
    return this.placesUpdated.asObservable();
  }

  setPlace(data) {
    this.place = data;
  }

  getPlace() {
    return this.place;
  }
}
