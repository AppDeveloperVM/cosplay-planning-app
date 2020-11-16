import { Injectable } from '@angular/core';
import { Notice } from '../models/notice.model';

@Injectable({
  providedIn: 'root'
})
export class NoticesService {
  noticeList = [];
  notice: Notice;
  noticesUpdated: any;

  constructor() { }

  setNotices(data) {
    this.noticeList = data;
  }

  getNotices() {
    return this.noticeList;
  }

  getNoticesUpdateListener() {
    return this.noticesUpdated.asObservable();
  }

  setNotice(data) {
    this.notice = data;
  }

  getNotice() {
    return this.notice;
  }

}
