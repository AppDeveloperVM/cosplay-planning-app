import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-cosplay-group-item',
  templateUrl: './cosplay-group-item.component.html',
  styleUrls: ['./cosplay-group-item.component.scss'],
})
export class CosplayGroupItemComponent implements OnInit, AfterViewInit {
  @Input() cosplaygroup: CosplayGroup;
  public imgSrc: any;

  constructor(
    private st: AngularFireStorage,
    private uploadService: UploadImageService) {
  }

  ngOnInit() {
    console.log(this.cosplaygroup);
    let ref = this.st.ref(this.cosplaygroup.imageUrl);
    this.imgSrc = ref.getDownloadURL();
    console.log("image: " + this.imgSrc);
  }

  

  ngAfterViewInit() {
  }

}
