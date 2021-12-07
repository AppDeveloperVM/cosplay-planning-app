import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

const TOKEN_KEY = 'my-token';

interface UserData {
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  emailVerified: boolean,
  accessToken: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'user1';
  private _userData = new BehaviorSubject<User[]>([]);
  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private token = '';

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  get user() {
    return this._userData.asObservable();
  }


  constructor(private http:HttpClient,private router: Router) {
    
  }

  loginWithGoogle(){
    var provider = new (firebase.auth as any)(AuthService).GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  login(credentials: {email, password}){ //:Observable<any>
    this.isAuthenticated.next(true);
   
    //needs to search for user

    return this.http.post('https://cosplay-planning-app.firebaseio.com/users.json', credentials).pipe(
      map((data: any) => data.token),
      /*switchMap(token => {
        return from(localStorage.set({key: TOKEN_KEY, value: token}));
      }),*/
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  signUp(data){ 
    let generatedId: string;
    this.isAuthenticated.next(true);

    const newUser = 
    new User(
      Math.random().toString(),
      data.email,
      data.displayName,
      "",
      false,
      ""
    );

    var uid = "-MqJr4JhnCtq-uvPp0zb";

    //creating user works
    return this.http
    .get<UserData>(
      `https://cosplay-planning-app.firebaseio.com/users.json/${uid}.json`,
      {...newUser})
    .pipe(
        switchMap(userData => {
          generatedId = userData.uid;
          return this.user;
        }),
        take(1),
        tap(user => {
          //newUser.uid = generatedId;
          this._userData.next(user.concat(newUser));
        })
    );
  }

  

  logout() {
    this._userIsAuthenticated = false;
    localStorage.removeItem('auth_token');
    //return localStorage.remove({key: TOKEN_KEY});
  }

  getToken() {
  	return !!localStorage.get('auth_token')
  }


  /*private setSession(authResult) {
      const expiresAt = moment().add(authResult.expiresIn,'second');

      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  } */  

}
