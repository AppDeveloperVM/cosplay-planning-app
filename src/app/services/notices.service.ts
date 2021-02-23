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

  constructor() { }

  addNotice(
    userFrom: string,
    type: string,
    text: string
  ) {

    const newNotice = {
        'user_from' : userFrom,
        'type' : type,
        'text' : text
      };

    this.noticeList.push(newNotice);
  }

  setNotice(data) {
    this.notice = data;
  }

  getNotice() {
    return this.notice;
  }

  setNotices(data) {
    this.noticeList = data;
  }

  getNotices() {
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
   

}
