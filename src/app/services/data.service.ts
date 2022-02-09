import { Injectable, Component } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { Componente } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  _editMode = new BehaviorSubject<boolean>(false)
  editMode$ = this._editMode.asObservable()

  /**
    * @param startVal first value to output (defaults to null)
    */
  constructor( ) {
  }

  modeChanged(value) {
    this._editMode.next(value)
  }

  getUsers() {
    return; // ...
  }

  getMenuOpts() {
    return; // this.http.get<Componente[]>('/assets/data/menu.json');
  }

}
