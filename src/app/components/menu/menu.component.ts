import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
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
    private dataService: DataService,private authService: AuthService
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
        title : "Profile",
        url   : "/profile",
        icon  : "person-circle-outline"
      },
      {
        title : "Cosplay",
        url   : "/main",
        icon  : "body"
      },
      {
        title : "Planning",
        url   : "/main/tabs/planning",
        icon  : "calendar"
      },
      {
        title : "Cosplay Groups",
        url   : "/main/tabs/cosplay-groups",
        icon  : "people-outline"
      },
      {
        title : "Settings",
        url   : "/settings",
        icon  : "settings-outline"
      },
      {
        title : "Logout",
        url   : "/logout",
        icon  : "log-out-outline"
      },
    ]
  }

  onLogout() {
    this.authService.logout();
  }

}
