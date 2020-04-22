import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyCosplaysService {

  private _cosplays = [];

  get cosplays() {
    return [...this._cosplays];
  }

  constructor() { }
}
