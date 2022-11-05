import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { CosplayGroupService } from 'src/app/services/cosplay-group.service';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';


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

    this.uploadImgService.getStorageImgUrl(this.imageName,0).then((val)=>{
      this.imageUrl = val;
    }).finally(() => {
      this.isLoading = false;
    });

    this.uploadImgService.getStorageImgUrl(this.imageName,2).then((val)=>{
      this.cosplaygroup.imageUrl = val;
    }).finally(() => {
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
