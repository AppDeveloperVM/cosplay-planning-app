import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authenticationService';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private router: Router,private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.SignOut();
    this.router.navigateByUrl(
      '/login',{ replaceUrl: true }
    )
  }

}
