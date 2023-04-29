import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { GlobalConstants } from 'app/common/global-constants';
import { DataService } from '../../../../services/data.service';
import { PlanningService } from '../../../../services/planning.service';
import { StorageService } from '../../../../services/storage.service';
import { UploadImageService } from '../../../../services/upload-img.service';
import { Planning } from '../planning.model';

@Component({
  selector: 'app-planning-item',
  templateUrl: './planning-item.component.html',
  styleUrls: ['./planning-item.component.scss'],
})
export class PlanningItemComponent implements OnInit {
  @Input() planning: Planning;
  public imgSrc: any;
  isMobile: boolean;
  imageUrl: string;
  imageName : string;
  defaultImg = GlobalConstants.defaultImgSRC;

  constructor(
    private router: Router, 
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private planningService: PlanningService,
    private dataService: DataService,
    private uploadImgService : UploadImageService,
    private storageService : StorageService
  ) { }

  ngOnInit() {
    //console.log(this.planning);
    this.checkPlatform();

    this.imageName = this.planning.imageUrl;
    this.uploadImgService.getStorageImgUrl(this.imageName,0).then((val)=>{
      this.imageUrl = val;
    })

    this.uploadImgService.getStorageImgUrl(this.imageName,2).then((val)=>{
      this.planning.imageUrl = val;
    })
  }

  checkPlatform() {
    this.isMobile = this.platform.is('mobile');
  }

  onGoToSee(planningId: string): void {
    this.router.navigate(['main/tabs/planning/details/'+ planningId] );
  }

  onGoToEdit(planningId: string): void {
    this.router.navigate(['main/tabs/planning/edit/'+ planningId]);
  }

  async onDeletePlanning(planningId: string): Promise<void> {

    this.storageService.deleteThumbnail(this.imageName)
    .then( async (res) => {
      //Thumbnail deleted .. continue

      await this.loadingCtrl
      .create({
        message: 'Deleting Planning...'
      })
      .then(loadingEl => {
        loadingEl.present();
          try {
            this.planningService.onDeletePlanning(planningId);
          }catch (err) {
            console.log(err);
          }

          setTimeout(() => {
            loadingEl.dismiss();
          }, 500);

        //this.router.navigate(['main/tabs/cosplay-groups']);
      });

    })
    .catch( (err) => {
      console.log('Error deleting planning Thumbnail :' + err);
      
    });
  }

}
