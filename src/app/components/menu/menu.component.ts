import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  navigate: any;

  menuOpts: Observable<Componente[]>;

  constructor(
    private dataService: DataService,
    )
    {
    this.sideMenu();
    }

  ngOnInit() {
    // this.menuOpts = this.dataService.getMenuOpts();
  }

  sideMenu() {

    this.navigate =
    [
      {
        title : "Main",
        url   : "/main",
        icon  : "apps-outline"
      },
      {
        title : "Profile",
        url   : "/profile",
        icon  : "person-circle-outline"
      },
      {
        title : "Cosplay Groups",
        url   : "/main/tabs/cosplays/cosplay-groups",
        icon  : "people-outline"
      },
      {
        title : "Settings",
        url   : "/settings",
        icon  : "settings-outline"
      },
      {
        title : "Logout",
        url   : "/",
        icon  : "log-out-outline"
      },
    ]
  }

}
