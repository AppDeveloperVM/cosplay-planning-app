import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { Notice } from 'src/app/models/notice.model';
import { AuthenticationService } from 'src/app/services/authenticationService';
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
  notifications$ = this.noticesService.notices$;

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
    private dataService: DataService,
    public authService: AuthenticationService
  ) {
    this.notifications$.subscribe((data)=> {
      this.notifications.push(data);
      console.log(this.notifications);
    })
    //this.noticesService.fetchFileData();
    this.noticesService.loadLocalData('notifs');
    this.notifications = this.noticesService.getNotices();
  }

  ngOnInit() {

    this.subscription = this.dataService.editMode$.subscribe(r => this.editMode = r)
  }

  async mostrarPop( event ) {
    console.log(this.notifications);
    this.noticesService.addNotificationTest();

    if(this.notifications.length > 0){
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
    
    }
  }

  async enableEdit(): Promise<void>{
    this.dataService.modeChanged(!this.editMode);
    console.log("edit mode:"+this.editMode);
  }

}
