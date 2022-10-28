import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { resolve } from 'path';
import { AuthenticationService } from "../../services/authenticationService";


@Component({
  selector: 'app-verified-email',
  templateUrl: './verified-email.page.html',
  styleUrls: ['./verified-email.page.scss'],
})
export class VerifiedEmailPage implements OnInit {

  constructor(
    public router: Router,
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public authService: AuthenticationService
    ) {
      
    }

  ngOnInit() {
    this.changeToVerifiedAccount();
  }

  changeToVerifiedAccount(){

    this.authService.ChangeToVerifiedAccount()
    .then( (res) => {
      console.log(res);
      this.goToHomePage();
    })
    .catch( (err) => {
      console.log(err);
    });

  }

  goToHomePage(){
    this.router.navigate(['/']);
  }

}
