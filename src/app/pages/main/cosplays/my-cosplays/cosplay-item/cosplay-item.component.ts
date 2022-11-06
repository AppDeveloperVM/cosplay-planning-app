import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CosplaysService } from '../../../../../services/cosplays.service';
import { DataService } from '../../../../../services/data.service';
import { StorageService } from '../../../../../services/storage.service';
import { UploadImageService } from '../../../../../services/upload-img.service';
import { Cosplay } from '../../../../../models/cosplay.model';

@Component({
  selector: 'app-cosplay-item',
  templateUrl: './cosplay-item.component.html',
  styleUrls: ['./cosplay-item.component.scss'],
})
export class CosplayItemComponent implements OnInit {
  @Input() cosplay: Cosplay;
  public imgSrc: any;
  editMode : boolean;
  subscription: Subscription;
  imageUrl: String;
  imageName : String;
  isLoading : boolean = true;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private cosplaysService: CosplaysService,
    private dataService: DataService,
    private uploadImgService : UploadImageService,
    private storageService : StorageService
  ) { }  

  ngOnInit() {
    this.imageName = this.cosplay.imageUrl;

    if(this.imageName == null){
      this.imageUrl = null;
      this.isLoading = false;
      return false;
    }

      this.uploadImgService.getStorageImgUrl(this.imageName, 0).then((val)=>{
        this.imageUrl = val;
      }).finally(() => {
        this.isLoading = false;
      });
 
  }

  ngAfterViewInit() {

  }

  onGoToSee(cosplayId: string): void {
    this.router.navigate(['main/tabs/cosplays/my-cosplays/details/'+cosplayId]);
  }  

  async onDeleteCosplay(cosplayId: string): Promise<void> {

    this.storageService.deleteThumbnail(this.imageName)
    .then( async (res) => {
      //Thumbnail deleted .. continue

      await this.loadingCtrl
      .create({
        message: 'Deleting Cosplay...'
      })
      .then(loadingEl => {
        loadingEl.present();
          try {
            this.cosplaysService.onDeleteCosplay(cosplayId);
          }catch (err) {
            console.log('Error deleting cosplay: ' + err);
          }

          setTimeout(() => {
            loadingEl.dismiss();
          }, 500);

      });

    })
    .catch( (err) => {
      console.log('Error deleting cos Thumbnail :' + err);
      
    });

    
  }

}
