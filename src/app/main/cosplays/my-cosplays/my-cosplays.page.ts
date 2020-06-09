import { Component, OnInit } from '@angular/core';
import { CosplaysService } from '../cosplays.service';
import { Cosplay } from '../cosplay.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PopoverController } from '@ionic/angular';
import { PopinfoComponent } from 'src/app/components/popinfo/popinfo.component';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-cosplays',
  templateUrl: './my-cosplays.page.html',
  styleUrls: ['./my-cosplays.page.scss'],
})
export class MyCosplaysPage implements OnInit {
  loadedCosplays: Cosplay[];
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
    this.loadedCosplays = this.cosplaysService.cosplays;

    this.relevantCosplays = this.loadedCosplays;

    this.listedLoadedCosplays = this.loadedCosplays.slice(0);

    this.notifications = [{name: 'John'}, {name: 'John'}, {name: 'John'}];
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantCosplays = this.loadedCosplays; // show everything (?)
    } else {
      // filtro - a mostrar tras elegir segundo segmented button on main
      this.relevantCosplays = this.loadedCosplays.filter(
        cosplay => cosplay.status !== true // checking status
      );
    }
    this.listedLoadedCosplays = this.relevantCosplays.slice(0);
    console.log(event.detail);
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

}
