import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { User } from './../models/user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';
import { resolve } from 'path';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: any;
  //Collections
  usersObsv: Observable<User[]>;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.usersCollection = afStore.collection<User>('users');

    

    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
      //console.log('user:',user.uid);
    });
  }

  getUsers(): void {
    this.usersObsv = this.usersCollection.snapshotChanges().pipe(
        map( actions => actions.map( a => a.payload.doc.data() as User))
    )
  }

  getUserByUID(uid: string) {
    return this.afStore
    .collection('users')
    .doc(uid).valueChanges()
    /*.get().subscribe(data => {
      console.log('data : ', data);
      this.userData = data;
    })*/
  }

  getUserByEmail(email: string) {
    return this.afStore
    .collection('users')
    .doc(email).valueChanges()
    /*.get().subscribe(data => {
      console.log('data : ', data);
      this.userData = data;
    })*/
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }
  // Register user with email/password
  RegisterUser(email, password) {

    var register = new Promise( async (resolve, reject) => {

      var uidGenerated = null; 

      await this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(
        (user)=> {
          uidGenerated = user.user.uid;
          console.log('uid: '+ uidGenerated);
        }
      )
      
      const user = {
        uid: uidGenerated,
        email: email,
        displayName: email,
        photoURL : null,
        emailVerified : false
      };

      this.SetUserData(user).then( (userRecord) => {
        console.log('User succesfully registered in Firebase');
        resolve('Good');

      }).catch((error) => {
        window.alert(error.message);
        reject('Error,'+ error);
      })

      
    }
    ) 

    return register;
  }
  // Email verification when new user register
  SendVerificationMail() {
    return this.ngFireAuth.currentUser.then((user) => {
      return user.sendEmailVerification({
        url : "https://cosplay-planning-app.vercel.app/verified-email"
      }).then(() => {
        this.router.navigate(['verify-email']);
      }).catch((error) => {
        window.alert(error.message)
      })
    });
  }
  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'Password reset email has been sent, please check your inbox.'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
    //
  }
  // Returns true when user's email is verified
  //get
  isEmailVerified(email): boolean {
    // Se debe chequear si está verified en FIREBASE
    //const user = JSON.parse(localStorage.getItem('user'));

    var userWithEmailX = new Promise<any>((resolve)=> { 
      this.afStore.collection('users', ref => ref.where('email', '==', email)).valueChanges()
      .subscribe(user => {
        resolve(user);
        this.userData = user;
      });
    });

    /* this.getUserByEmail(email).subscribe(userData => {
      this.userData = userData;
    }); */
    console.log('userData: ', this.userData);
    return this.userData.emailVerified !== false ? true : false;
  }

  CheckIfUserHasEmailVerified(){
   /*  getAuth()
    .getUser(uid)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
    }); */
  }

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}