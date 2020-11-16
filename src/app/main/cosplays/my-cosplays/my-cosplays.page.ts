import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CosplaysService } from '../cosplays.service';
import { Cosplay } from '../cosplay.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PopoverController } from '@ionic/angular';
import { PopinfoComponent } from 'src/app/components/popinfo/popinfo.component';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-my-cosplays',
  templateUrl: './my-cosplays.page.html',
  styleUrls: ['./my-cosplays.page.scss'],
})
export class MyCosplaysPage implements OnInit, OnDestroy {
  loadedCosplays: Cosplay[];
  isLoading = false;
  listedLoadedCosplays: Cosplay[];
  relevantCosplays: Cosplay[];
  private cosplaysSub: Subscription;
  private filter = 'all';
  notifications: any = [];

  constructor(
    private cosplaysService: CosplaysService,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private routermodule: RouterModule,
    private http: HttpClient
  ) {
   }

  ngOnInit() {
    this.fetchPlacesData();

    this.cosplaysSub = this.cosplaysService.cosplays.subscribe(cosplays => {
      this.loadedCosplays = cosplays;
      this.listedLoadedCosplays = this.loadedCosplays;
      this.onFilterUpdate(this.filter);
    });
    // this.relevantCosplays = this.loadedCosplays;

    /* this.httpClient.get('assets/notifications.json').subscribe(data => {
      console.log(data);
      this.notifications = data['notifications'];
    });
    */
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.cosplaysService.fetchCosplays().subscribe(() => {
      this.isLoading = false;
    });
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
  }

  fetchPlacesData() {
    fetch('../../assets/data/notifications.json').then(res => res.json()) // json file depends on planning id
      .then(data => {
        console.log(data.notifications);
        this.notifications = data.notifications;
        });
  }


  async mostrarPop( event ) {
    // console.log('notif:' + this.notifications);

    const popover = await this.popoverCtrl.create({
      component: PopinfoComponent,
       componentProps: { notifications: this.notifications},
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
