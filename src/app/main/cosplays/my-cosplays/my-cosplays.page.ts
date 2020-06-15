import { Component, OnInit, OnDestroy } from '@angular/core';
import { CosplaysService } from '../cosplays.service';
import { Cosplay } from '../cosplay.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PopoverController } from '@ionic/angular';
import { PopinfoComponent } from 'src/app/components/popinfo/popinfo.component';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-cosplays',
  templateUrl: './my-cosplays.page.html',
  styleUrls: ['./my-cosplays.page.scss'],
})
export class MyCosplaysPage implements OnInit, OnDestroy {
  loadedCosplays: Cosplay[];
  private cosplaysSub: Subscription;
  private filter = 'all';
  listedLoadedCosplays: Cosplay[];
  relevantCosplays: Cosplay[];
  notifications: any[];

  constructor(
    private cosplaysService: CosplaysService,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private routermodule: RouterModule
  ) { }

  ngOnInit() {
    this.cosplaysSub = this.cosplaysService.cosplays.subscribe(cosplays => {
      this.loadedCosplays = cosplays;
      this.onFilterUpdate(this.filter);
    });
    this.relevantCosplays = this.loadedCosplays;

    this.listedLoadedCosplays = this.loadedCosplays;

    this.notifications = [{name: 'John'}, {name: 'John'}, {name: 'John'}];
  }

  onFilterUpdate(filter: string) {
    if (filter === 'all') {
      this.relevantCosplays = this.loadedCosplays; // show everything (?)
    } else {
      // filtro - a mostrar tras elegir segundo segmented button on main
      this.relevantCosplays = this.loadedCosplays.filter(
        cosplay => cosplay.status !== true // checking status
      );
    }
    this.listedLoadedCosplays = this.relevantCosplays;
    console.log(filter);
  }


  async mostrarPop( event ) {
    // console.log('notif:' + this.notifications);

    const popover = await this.popoverCtrl.create({
      component: PopinfoComponent,
      componentProps: { notif_count: this.notifications},
      event,
      // mode: 'ios',
      backdropDismiss: true
    });

    await popover.present();

    const { data } = await popover.onWillDismiss(); // onDidDismiss();
  }

  /* getItems() {
    return this.http.get<[]>('components/popinfo');
  }*/

  ngOnDestroy() {
    if (this.cosplaysSub) {
      this.cosplaysSub.unsubscribe();
    }
  }

  

}
