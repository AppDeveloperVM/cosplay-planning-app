import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { NoticesService } from 'src/app/services/notices.service';
import { PopinfoComponent } from '../popinfo/popinfo.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {
  @Input() titulo: string;
  @Input() routeArray: any;
  notifications: any = [];
  checked_notif = false;
  obj : any;
  notif_count: number = 0

  editMode: boolean;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    private noticesService: NoticesService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    //if(!this.noticesService.fetchJson()){
    //}
    this.notifications = this.noticesService.fetchFileData();
    this.subscription = this.dataService.editMode$.subscribe(r => this.editMode = r)
  }


  async mostrarPop( event ) {

    if (this.notif_count) { 
      console.log(this.notifications);

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

  async enableEdit(): Promise<void>{
    this.dataService.modeChanged(!this.editMode);
    console.log("edit mode:"+this.editMode);
  }

}
