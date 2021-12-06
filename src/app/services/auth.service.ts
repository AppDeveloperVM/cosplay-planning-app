import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

interface UserData {
  name: string;
  email: string;
  photoUrl: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'user1';

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private http:HttpClient,private router: Router) { }


  loginWithGoogle(){
    var provider = new (firebase.auth as any)(AuthService).GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  login(data){ //:Observable<any>
    this._userIsAuthenticated = true;

    var email = data.email;
    var password = data.password;
   
    /*return this.http
    .post<User>('https://cosplay-planning-app.firebaseio.com/users.json',{email,password})//.do(res => this.setSession);
    .subscribe(() => {
      this.router.navigateByUrl(
        '/profile'
      )
    });*/

    this.router.navigateByUrl(
      '/'
    )
  }

  signUp(data){ 
    this._userIsAuthenticated = true;

    const newUser = new User(
      Math.random().toString(),
      data.email,
      data.displayName,
      "",
      false
    );

    return this.http
    .post<User>(
      'https://cosplay-planning-app.firebaseio.com/users.json',
      {...newUser, id: null}) 
    .subscribe(() => {
      this.router.navigateByUrl(
        '/'
      )
    });
  }

  

  logout() {
    this._userIsAuthenticated = false;
    
    this.router.navigate([
      '/login'
    ])
  }


  /*private setSession(authResult) {
      const expiresAt = moment().add(authResult.expiresIn,'second');

      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  } */  

}
