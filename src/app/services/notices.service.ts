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
  notices$ = new Subject<Notice[]>();
  noticeList = [];
  
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

    //if (this.containsObject(newNotice) === false )  {
      this.noticeList.push(newNotice);
      this.notices$.next(this.noticeList);
    //}
    
  }
  /*
  getNotice(id: String) {
    return this.notice;
  }
  */

  //
  setNotices(data : any) {
    this.notices$.next(data);
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

  fetchFileData() {

    fetch('../../assets/data/notifications.json')
    .then(res => res.json())
    .then(data => {
      console.log("Fetching Notifications from json..");
      console.log(data.notifications);
      this.setNotices(data.notifications);
    });

  }
   

}
