import { Injectable, Component } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { filter, switchMap } from 'rxjs/operators';


const STORAGE_KEY = 'mylist';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storageReady = new BehaviorSubject(false);

  _editMode = new BehaviorSubject<boolean>(false)
  editMode$ = this._editMode.asObservable()

  constructor(private storage: Storage) {
    this.init();
  }

  async init(){
    await this.storage.defineDriver(cordovaSQLiteDriver);
    await this.storage.create();
    this.storageReady.next(true);
    console.log('Storage Ready');
  }

  /*
   * If localStoge is empty, we call getDataFromFirebase
   * method set user data from firebase on localStorage
   */
  checkLocalStorage(item: string){
    if (!this.storage.get(item)) {
      return false;
    } else {
      return true;
    }
  }

  checkIfExists(item) {
    
  }

  getData(storagekey = null){
    let key = storagekey != null ? storagekey : STORAGE_KEY;
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => {
        console.log('OK');
        return from(this.storage.get(key) || of([]));
      })
    )
    
  } 

  async addData(storagekey = null, item, unique = false){
    let key = storagekey != null ? storagekey : STORAGE_KEY;
    let storedData = await this.storage.get(key) || [];
    let stringified = item;// JSON.stringify( )
    //check if item / id already exists
      if(unique == false){
        if(!storedData.includes(stringified)){
          storedData.push(stringified);//add object item to localVar
        }
      }else if(unique == true){
        await this.clearKey(key);
        storedData = stringified;
      }

    return this.storage.set(key, storedData);
  }

  async removeData(storagekey = null,index){
    let key = storagekey != null ? storagekey : STORAGE_KEY;
    const storedData = await this.storage.get(key) || [];
    storedData.splice(index, 1);
    return this.storage.set(key, storedData);
  }

  async clearKey(storagekey = null) {
    await this.storage.remove(storagekey);
  }

  async clearAllData(){
    await this.storage.clear();
  }

  modeChanged(value) {
    this._editMode.next(value)
  }



}
