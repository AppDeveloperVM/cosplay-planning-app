import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-cosplay-group-item',
  templateUrl: './cosplay-group-item.component.html',
  styleUrls: ['./cosplay-group-item.component.scss'],
})
export class CosplayGroupItemComponent implements OnInit, AfterViewInit {
  @Input() cosplaygroup: CosplayGroup;
  public imgSrc: any;
  isMobile: boolean;

  navigationExtras: NavigationExtras = {
    state : {
      cosplaygroup: null
    }
  }

  constructor(
    private st: AngularFireStorage,
    private uploadService: UploadImageService,
    private router: Router,
    private platform: Platform
  ) {
    
  }

  ngOnInit() {
    console.log(this.cosplaygroup);
    this.checkPlatform();
  }

  checkPlatform() {
    this.isMobile = this.platform.is('mobile');
  }

  ngAfterViewInit() {
  }

  onGoToSee(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplays/cosplay-groups/cosplay-group-details/'], this.navigationExtras );
  }

  onGoToEdit(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplays/cosplay-groups/edit/'], this.navigationExtras );
  }

}
