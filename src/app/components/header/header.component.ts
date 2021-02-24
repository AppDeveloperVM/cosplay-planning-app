import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PopoverController } from '@ionic/angular';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
  ) { }

  ngOnInit() {
    this.fetchFileData(); // get notifs from file - this.file_notifications
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

}
