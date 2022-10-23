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
      this.changeToVerifiedAccount();
    }

  ngOnInit() {
    
  }

  changeToVerifiedAccount(){

    const verify = new Promise( (resolve,reject) => {
      this.ngFireAuth.authState.subscribe((user) => {

        this.afStore.doc(
          `users/${user.uid}`
        ).update({
          emailVerified : true
        })
        .then( (res) => {
          console.log(res);
        })
        .catch( (err) => {
          alert(err);
        });

      })
    }).then( (res) => {
      
    })
    .catch( (err) => {
      
    });

    

  }

  goToHomePage(){
    this.router.navigate(['/']);
  }

}
