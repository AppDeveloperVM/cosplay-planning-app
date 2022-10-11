import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notice } from '../models/notice.model';
import { notifData } from '../models/notifData.model';
import { DataService } from './data.service';

interface NoticeData {
  userFrom: string;
  type: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticesService {
  _notices$ = new Subject<Notice[]>();
  noticeList = [];
  public notifObj : notifData;
  
  get notices$(): Observable<Notice[]> {
    return this._notices$.asObservable();
  }

  constructor(private dataService: DataService) { 
  }

  addNotice(
    userFrom: string,
    category: string,
    type: string,
    text: string
  ) {

    const newNotice = 
      {
        "user_from" : userFrom,
        "category" : category,
        "type" : type,
        "text" : text
      };

    console.log("checking notice list");
    console.log(this.noticeList);

    //if (this.containsObject(newNotice) === false )  {
      this.noticeList.push(newNotice);
      this._notices$.next(this.noticeList);
    //}
    
  }

  setNotices(data : any) {
    this._notices$.next(data);
    this.noticeList = data;
  }

  getNotices() {
    return this.noticeList;
  }

  containsObject(obj) {
    for (var i = 0; i < this.noticeList.length; i++) {

        if (this.noticeList[i] == obj) {
          console.log(this.noticeList[i]);
          console.log(" = ");
          console.log(obj);
            return true;
        }
    }

    return false;
  }

 /*  fetchFileData() {

    fetch('../../assets/data/notifications.json')
    .then(res => res.json())
    .then(data => {
      //console.log("Fetching Notifications from json..");
      this.setNotices(data.notifications);
      console.log(data.notifications);
    });

  }  */

  async loadLocalData(key){
    console.log('->Load local data');
    
    //await this.dataService.addData('user',`Vic ${Math.floor(Math.random() * 100)}`);
    this.dataService.getData(key).subscribe(async notifications => {
      if(notifications != null){
        console.log(notifications);
        //this.setNotices(notifications);
      } else {
        await this.addNotificationTest();
      }
      this.setNotices(notifications);
    });
  }

  async addNotificationTest() {
    console.log('-> Triggered update');
    this.notifObj = new notifData('user', 'cosplay', 'request', 'notificacion de prueba');
    //await this.settings._settings$.next(this.settingsObj);

    this.dataService.addData('notifs', this.notifObj, true);
    console.log(this.notifObj);
    //await this.dataService.addData(LOCALDATAKEY, this.settingsObj, true);
  }

}
