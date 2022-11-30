import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { UploadImageService } from '../../../../services/upload-img.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { CosplayGroupService } from '../../../../services/cosplay-group.service';
import { DataService } from '../../../../services/data.service';
import { StorageService } from '../../../../services/storage.service';
import{ GlobalConstants } from './../../../../common/global-constants';


@Component({
  selector: 'app-cosplay-group-item',
  templateUrl: './cosplay-group-item.component.html',
  styleUrls: ['./cosplay-group-item.component.scss'],
})
export class CosplayGroupItemComponent implements OnInit, AfterViewInit {
  @Input() cosplaygroup: CosplayGroup;
  public imgSrc: any;
  isMobile: boolean;
  imageUrl: String;
  imageName : String;
  isLoading : boolean = true;
  defaultImg = GlobalConstants.defaultImgSRC;

  navigationExtras: NavigationExtras = {
    state : {
      cosplaygroup: null
    }
  }

  constructor(
    private st: AngularFireStorage,
    private uploadService: UploadImageService,
    private router: Router,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private cosplayGroupService: CosplayGroupService,
    private dataService: DataService,
    private uploadImgService : UploadImageService,
    private storageService : StorageService
  ) {
    
  }

  ngOnInit() {
    //console.log(this.cosplaygroup);
    this.checkPlatform();
    this.imageName = this.cosplaygroup.imageUrl;

    if(this.imageName == null){
      this.imageUrl = null;
      this.isLoading = false;
      return false;
    }

    var imgSrc = null;

    this.uploadImgService.getStorageImgUrl(this.imageName,0)
    .then((val)=>{
      imgSrc = val;
      console.log(val);
      
    })
    .catch((err) => {
      console.log('Error img size 0: ' + err);
      var custom_err = "";
      
      switch(err){
        case 'storage/object-not-found':
          custom_err = '';
        break;
      }
    }).finally(() => {
      console.log('image loaded');
      
      this.imageUrl = imgSrc;
      this.isLoading = false;
    });

    this.uploadImgService.getStorageImgUrl(this.imageName,2)
    .then((val)=>{
      this.cosplaygroup.imageUrl = val;
    })
    .catch((err) => {
      console.log('Error img size2 : ' + err);
      var custom_err = "";
      
      switch(err){
        case 'storage/object-not-found':
          custom_err = '';
        break;
      }
    })
    .finally(() => {
      this.isLoading = false;
    });
  }

  checkPlatform() {
    this.isMobile = this.platform.is('mobile');
  }

  ngAfterViewInit() {
  }

  onGoToSee(item: any): void {
    this.router.navigate(['main/tabs/cosplay-groups/details/'+ this.cosplaygroup.id]);
  }

  onGoToEdit(item: any): void {
    this.router.navigate(['main/tabs/cosplay-groups/edit'+ this.cosplaygroup.id] );
  }

  async onDeleteCosGroup(cosGroupId: string): Promise<void> {


    await this.loadingCtrl
      .create({
        message: 'Deleting Cosplay Group...'
      })
      .then(loadingEl => {
        loadingEl.present();
          try {
            this.cosplayGroupService.onDeleteCosGroup(cosGroupId)
            .then( (res) => {

              this.storageService.deleteThumbnail(this.imageName)
              .then( async (res) => {
                //Thumbnail deleted .. continue
                console.log('Thumbnail deleted!');
              })
              .catch( (err) => {
                console.log('Error deleting cosGroup Thumbnail :' + err);
                //AVISA ADMIN
              });

            })
          }catch (err) {
            console.log(err);
          }

          setTimeout(() => {
            loadingEl.dismiss();
          }, 500);

        //this.router.navigate(['main/tabs/cosplay-groups']);
      });

    
  }

}
