import { Injectable } from '@angular/core';
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
  noticeList = [];
  notice: Notice;
  noticesUpdated: any;

  jsonFetched : boolean = false;

  constructor() { }

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
  //
  setNotice(data : any) {
    this.notice = data;
  }

  getNotice() {
    return this.notice;
  }
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

  fetchJson(){
    var fetch : Boolean = true;
    if(this.jsonFetched == false){
      fetch = true;
      this.jsonFetched = true;
    }else{
      fetch = false;
    }

    return fetch;
  }
   

}
