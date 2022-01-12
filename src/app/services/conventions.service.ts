import { Injectable } from '@angular/core';
import { Convention } from '../main/conventions/conventions.model';

@Injectable({
  providedIn: 'root'
})
export class ConventionsService {
  private _conventions: Convention[] = [
  new Convention('c1', 'Japan Weekend Septiembre', 'Spain', 'https://static-2.ivoox.com/canales/1/7/0/4/6791535494071_MD.jpg') 
  ]

  get cons(){
    return [...this._conventions];
  }

  constructor() { }
}
