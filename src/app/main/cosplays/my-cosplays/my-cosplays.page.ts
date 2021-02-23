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
import { NoticesService } from 'src/app/services/notices.service';

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
  file_notifications: any = []; // past ones from file
  all_notifications: any = []; // full list 
  notifications: any = []; // last ones
  checked_notif = false;

  constructor(
    private cosplaysService: CosplaysService,
    private noticesService: NoticesService,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private routermodule: RouterModule,
    private http: HttpClient
  ) {
   }

  ngOnInit() {
    this.fetchFileData(); // get notifs from file - this.file_notifications
    this.noticesService.setNotices(this.all_notifications);
    //this.notifications = this.noticesService.getNotices();

    this.cosplaysSub = this.cosplaysService.cosplays.subscribe(cosplays => {
      this.loadedCosplays = cosplays;
      this.listedLoadedCosplays = this.loadedCosplays;
      this.onFilterUpdate(this.filter);
    });

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

   fetchFileData() {
    fetch('../../assets/data/notifications.json').then(res => res.json())
      .then(data => {
        console.log(data.notifications);
        this.notifications.push(data.notifications);

        //example - this.noticesService.addNotice('SpaceRonin', 'request', 'Cosplay group character request');
        

        
        });
  }


  async mostrarPop( event ) {
    
    if (true) { // if this.notifications.length > 0
      console.log('notif:' + this.notifications);

      this.checked_notif = true;

      const popover = await this.popoverCtrl.create({
        component: PopinfoComponent,
         componentProps: { notifications: this.notifications},
        event,
        // mode: 'ios',
        backdropDismiss: true
      });
      await popover.present();
  
      const { data } = await popover.onWillDismiss(); // onDidDismiss();
    } else {
      console.log('No notifications - no popup');
    }

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
