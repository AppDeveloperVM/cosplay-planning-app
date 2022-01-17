import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { PlanningService } from 'src/app/services/planning.service';
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

  navigationExtras: NavigationExtras = {
    state : {
      planning: null
    }
  }

  constructor(
    private router: Router, 
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private planningService: PlanningService,
  ) { }

  ngOnInit() {
    //console.log(this.planning);
    this.checkPlatform();
  }

  checkPlatform() {
    this.isMobile = this.platform.is('mobile');
  }

  onGoToSee(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/planning/planning-detail'], this.navigationExtras );
  }

  onGoToEdit(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['main/tabs/planning/edit-planning'], this.navigationExtras );
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

      //this.router.navigate(['main/tabs/cosplays/cosplay-groups']);
    });
  }

}
