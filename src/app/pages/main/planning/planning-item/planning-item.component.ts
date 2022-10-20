import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { PlanningService } from 'src/app/services/planning.service';
import { UploadImageService } from 'src/app/services/upload-img.service';
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
  imageUrl: String;

  constructor(
    private router: Router, 
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private planningService: PlanningService,
    private dataService: DataService,
    private uploadImgService : UploadImageService
  ) { }

  ngOnInit() {
    //console.log(this.planning);
    this.checkPlatform();

    let imageName = this.planning.imageUrl;
    this.uploadImgService.getStorageImgUrl(imageName,0).then((val)=>{
      this.imageUrl = val;
    })

    this.uploadImgService.getStorageImgUrl(imageName,2).then((val)=>{
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
  }

}
