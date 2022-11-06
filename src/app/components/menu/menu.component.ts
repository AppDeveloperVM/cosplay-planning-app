import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthenticationService } from '../../services/authenticationService';
import { Observable } from 'rxjs';
import { Componente } from '../../interfaces/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  navigate: any;

  menuOpts: Observable<Componente[]>;

  constructor(
    private dataService: DataService,private authService: AuthenticationService
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
        title : "Cosplay Groups",
        url   : "/main/tabs/cosplay-groups",
        icon  : "people-outline"
      },
      {
        title : "Planning",
        url   : "/main/tabs/planning",
        icon  : "calendar"
      },
      {
        title : "Settings",
        url   : "/settings",
        icon  : "settings-outline"
      }
      
    ]

    if(this.authService.isLoggedIn){
      const logout = {
        title : "Logout",
        url   : "/logout",
        icon  : "log-out-outline"
      };
      this.navigate.push(logout);
    } else {
      const logout = {
        title : "Login",
        url   : "/login",
        icon  : "log-in-outline"
      };
      this.navigate.push(logout);
    }

  }


}
