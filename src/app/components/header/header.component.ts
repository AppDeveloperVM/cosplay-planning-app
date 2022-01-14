import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PopoverController } from '@ionic/angular';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    private noticesService: NoticesService,
  ) { }

  ngOnInit() {
    this.fetchFileData(); // get notifs from file - this.file_notifications
    
  }

  fetchFileData() {

    fetch('../../assets/data/notifications.json')
    .then(res => res.json())
    .then(data => {
      console.log("Fetching Notifications from json..");
      
        for(var i in data.notifications){
          this.noticesService.addNotice( 
            data.notifications[i].user_from ,
            data.notifications[i].type,
            data.notifications[i].text
          )
        }

        let notif_count = this.noticesService.getNotices().length;
        console.log("Notifications : " + notif_count);
    });
  }

  async mostrarPop( event ) {
    
    if (this.notifications.length > 0) { 
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

}
