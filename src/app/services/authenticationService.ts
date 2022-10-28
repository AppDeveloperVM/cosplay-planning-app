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
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, sendEmailVerification, reauthenticateWithCredential, signInWithEmailAndPassword, linkWithCredential, EmailAuthProvider  } from 'firebase/auth';
import { resolve } from 'path';
import { rejects } from 'assert';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: any;
  //Collections
  usersObsv: Observable<User[]>;
  uidGenerated = null;
  private usersCollection: AngularFirestoreCollection<User>;
  gotUserData = false;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private alertController: AlertController
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
  }

  getUserByEmail(email: string) {
    return this.afStore
    .collection('users')
    .doc(email).valueChanges()
  }

  // Login in with email/password
  SignIn(email, password) : Promise<any> {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        console.log(response);

        if(!this.getUserByEmail( response.user.email )){
          const alert = await this.alertController.create({
            header: 'User doesnt exist.',
            message: '-',
            buttons: ['OK'],
          });
          await alert.present();
          return false;
        } else {
          this.router.navigate(['/']);   
        }

        /* this.authService.isEmailVerified(email)
        .then( async (res) => {
          await console.log(res);

          if(res == true){
            this.router.navigate(['/']);          
          } else if (res == false) {
            const alert = await this.alertController.create({
              header: 'Login failed, Email isnt verified.',
              message: '-',
              buttons: [
                {
                  text: 'OK',
                  role: 'info'
                },
                {
                  text: 'Go to verify page',
                  role: 'info',
                  handler: data => {
                    this.router.navigate(['/verify-email'])
                  }
                }
              ],
            });
            alert.present();

          }
        })
        .catch( (err) => {
          alert(err);
        }) */

      }).catch((error) => {
        window.alert(error.message)
      })

  }
  // Register user with email/password
  RegisterUser(email, password) {

    try {

      var register = new Promise( async (resolve, reject) => {

        //var uidGenerated = null; 

        await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
        .then(
          (user)=> {
           
            this.uidGenerated = user.user.uid;
            console.log('user: ', user.user);
            console.log('uid: '+ this.uidGenerated);

            resolve('succesful');

          }
        ).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          switch(errorCode) {
            case 'auth/email-already-in-use':
              errorMessage = 'Already exists an account with the given email address.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Email invalid.';
              break;
            case 'auth/operation-not-allowed':
              errorMessage = 'Operation not allowed.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password is too weak.';
              break;
          }

          reject(errorMessage);
          //console.log('error catched 1');
          //alert(errorMessage);
          //console.log(errorMessage);
        });
  
      });

      const localUser = new Promise( async (resolve, reject) => {
        register.then( () => {

          const userData = {
            uid: this.uidGenerated,
            email: email,
            displayName: email,
            photoURL : null,
            emailVerified : false
          };
    
          this.SetUserData(userData).then( (userRecord) => {
            console.log('User succesfully registered in Firebase');
            resolve('User succesfully registered in Firebase');
            
          }).catch((error) => {
            console.log('error catched 2');
            reject(error);
          })
  

        }).catch((error) => {
          reject(error);
        });

      });
      //

      return localUser;
     
    } catch(error) {
      console.log(error);
    }

    
  }
  // Email verification when new user register
  SendVerificationMail() {

    

    return this.ngFireAuth.currentUser.then((user) => {

      const auth = getAuth();
      const email = user.email;
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for
        // this URL must be whitelisted in the Firebase Console.
        url: 'https://cosplay-planning-app.vercel.app/verified-email',
        // This must be true for email link sign-in.
        handleCodeInApp: true,
      };

      //sendEmailVerification(user, actionCodeSettings)
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('emailForSignIn', email);
          // ...
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
      
      /* return user.sendEmailVerification({
        url : "https://cosplay-planning-app.vercel.app/verified-email",
        handleCodeInApp: true,
      }).then(() => {
        this.router.navigate(['verify-email']);
      }).catch((error) => {
        console.log('error catched 3');
        window.alert(error.message)
      }) */

    });
  }

  CompleteAccessWithEmailLink() : Promise<any> {

    const promise = new Promise( (resolve, reject) => {

      console.log('email link? : ' + window.location.href)

      // Confirm the link is a sign-in with email link.
      const auth = getAuth();
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt('Please provide your email for confirmation');
        }

        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            // Additional user info profile not available via:
            console.log('User linked : ' , result.user);
            // result.additionalUserInfo.profile == null

            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser

            //-Get credentials for linked user
            const credential = EmailAuthProvider.credentialWithLink(
              email, window.location.href);

            // Link the credential to the current user.
            const auth = getAuth();
            linkWithCredential(auth.currentUser, credential)
              .then((usercred) => {
                console.log('usercred: ', usercred);
                // The provider is now successfully linked.
                // The phone user can now sign in with their phone number or email.
                this.ChangeToVerifiedAccount()
                .then( (res) => {
                  console.log(res);
                  this.router.navigate(['/']);
                })
                .catch( (err) => {
                  console.log(err)
                })
              })
              .catch((error) => {
                // Some error occurred.
                console.log(error)
              });

            

            resolve(true);

          })
          .catch((error) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
            reject(error);
          });

        } else {
          reject('is NOT SignInWithEmailLink');
        }
        
      });

      return promise;
  }

  ChangeToVerifiedAccount() : Promise<any>{

    const promise = new Promise( (resolve, reject) => {

      const localUserData = JSON.parse(localStorage.getItem('user'));
      if (  localUserData != null  ){
        const uid = localUserData.uid 
        console.log(localUserData);
          this.afStore.doc(
            `users/${uid}`
          ).update({
            emailVerified : true
          })
          .then( (res) => {
            console.log(res);

            
          })
          .catch( (err) => {
            alert(err);
          });
          resolve(true);

      } else {
        reject(false);
      }

    });

    return promise;

   /*  const verify = new Promise( (resolve,reject) => {
      this.ngFireAuth.authState.subscribe((user) => { */
        

      /* });
    }); */

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
        window.alert('error reseting password,error: '+ error );
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
  isEmailVerified(email): Promise<any> {
    // Se debe chequear si está verified en FIREBASE
    //const user = JSON.parse(localStorage.getItem('user'));
    var verified;

    var userWithEmailX = new Promise<Boolean>(async (resolve, reject)=> { 

      await this.afStore.collection('users', ref => ref.where('email', '==', email)).valueChanges()
      .subscribe(async user => {
        this.userData = user;
        verified = this.userData[0].emailVerified ;
        resolve(verified);
        return verified;
      }, error => {
        reject(false);
        return false;
      });

    }).then( (res) => {
      console.log(res);
      console.log('userData: ', this.userData[0]);
    }).catch( (err) => {
      console.log(err);
    });

    return userWithEmailX;
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
          this.router.navigate(['/']);
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