import { Injectable, Component } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { Componente } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  editMode: Boolean = false;

  constructor( ) { }

  changeEditMode(){
    var editMode = !this.editMode;
    return editMode;
  }

  getUsers() {
    return; // ...
  }

  getMenuOpts() {
    return; // this.http.get<Componente[]>('/assets/data/menu.json');
  }

}
