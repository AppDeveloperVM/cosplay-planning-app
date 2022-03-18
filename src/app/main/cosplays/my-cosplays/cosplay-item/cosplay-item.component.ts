import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CosplaysService } from 'src/app/services/cosplays.service';
import { DataService } from 'src/app/services/data.service';
import { UploadImageService } from 'src/app/services/upload-img.service';
import { Cosplay } from '../../../../models/cosplay.model';

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

  navigationExtras: NavigationExtras = {
    state : {
      cosplay: null
    }
  }

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private cosplaysService: CosplaysService,
    private dataService: DataService,
    private uploadImgService : UploadImageService
  ) { }  

  ngOnInit() {
    let imageName = this.cosplay.imageUrl;
    this.uploadImgService.getStorageImgUrl(imageName,0).then((val)=>{
      this.imageUrl = val;
    })

    this.uploadImgService.getStorageImgUrl(imageName,2).then((val)=>{
      this.cosplay.imageUrl = val;
    })
    
    console.log(this.cosplay);
  }

  onGoToSee(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/cosplays/my-cosplays/cosplay-details'], this.navigationExtras );
  }

  

  async onDeleteCosplay(cosplayId: string): Promise<void> {

    await this.loadingCtrl
    .create({
      message: 'Deleting Cosplay...'
    })
    .then(loadingEl => {
      loadingEl.present();
        try {
          this.cosplaysService.onDeleteCosplay(cosplayId);
        }catch (err) {
          console.log(err);
        }

        setTimeout(() => {
          loadingEl.dismiss();
        }, 500);

    });
  }

}
