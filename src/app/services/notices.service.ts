import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notice } from '../models/notice.model';

interface NoticeData {
  userFrom: string;
  type: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticesService {
  private notices$ = new Subject<Notice[]>();
  noticeList = [];
  
  noticesUpdated: any;
  jsonFetched : boolean = false;

  getNotices$(): Observable<Notice[]> {
    return this.notices$.asObservable();
  }

  constructor() {
    this.fetchFileData();
  }

  addNotice(
    userFrom: string,
    type: string,
    text: string
  ) {

    const newNotice = 
      {
        "user_from" : userFrom,
        "type" : type,
        "text" : text
      };

    console.log("checking notice list");
    console.log(this.noticeList);

    if (this.containsObject(newNotice) === false )  {
      this.noticeList.push(newNotice);
    }

    
  }
  /*
  getNotice(id: String) {
    return this.notice;
  }
  */

  //
  setNotices(data : any) {
    this.noticeList = data;
  }

  getNotices() {
    //this.noticeList.reverse();
    return this.noticeList;
  }

  getNoticesUpdateListener() {
    return this.noticesUpdated.asObservable();
  }

  // Notif Badges
  setNotifBadges(badgeNumber: number) {

  }

  getNotifBadges(){

  }

  increaseNotifBadges(){

  }

  decreaseNotifBadges(){

  }

  clearBadges(){

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

  fetchFileData() {

    fetch('../../assets/data/notifications.json')
    .then(res => res.json())
    .then(data => {
      console.log("Fetching Notifications from json..");
      
        /*for(var i in data.notifications){
          this.addNotice( 
            data.notifications[i].user_from ,
            data.notifications[i].type,
            data.notifications[i].text
          )
        }*/
        console.log(data.notifications);
        this.setNotices(data.notifications);

        this.noticeList = this.getNotices();
    });
    return this.noticeList;
  }
   

}
