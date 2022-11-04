import { Injectable } from '@angular/core';
//Firebase 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { getAuth, updateProfile } from "firebase/auth";

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users = new BehaviorSubject<User[]>([]);
  //Collections
  usersObsv: Observable<User[]>;
  users : any;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor( private readonly afs: AngularFirestore ) {
    this.usersCollection = afs.collection<User>('users');
    this.getUsers();
    console.log("users: "+this.usersObsv);

  }


  getUsers(): void {
    this.usersCollection.snapshotChanges().pipe(
        map( changes => 
          changes.map( a => 
            a.payload.doc.data() as User))
    ).subscribe( data => {
      this.users = data;
    })
  }

  getUserById(userId: string) {
    return this.afs
    .collection('users')
    .doc(userId)
    .valueChanges()
  }

  onUpdateUserProfile( displayName, photoURL) : Promise<any>{

    const auth = getAuth();
    const updatedServer = new Promise( (resolve,reject) => {

      const localUserData = JSON.parse(localStorage.getItem('user'));
      if (  localUserData != null  ){
        const uid = localUserData.uid ;
        console.log('uid: '+uid);
        
        console.log(localUserData);
          const ref = this.afs.doc(
            `users/${uid}`
          ).update({
            photoURL,
            displayName
          })
          .then( (res) => {
            //works!
            console.log('updated doc of users: '+ res);
            
          })
          .catch( (err) => {
            alert(err);
          });
          resolve(true);

      } else {
        reject(false);
      }

    });


    const updatedLocally = new Promise( (resolve, reject) => {
      updateProfile(auth.currentUser, {
        displayName, photoURL
      }).then((res) => {
        resolve(res);
        
      }).catch((error) => {
        reject(error);
      });
    } );


    const promise = new Promise( (resolve, reject) => {

      updatedServer.then( (res) => {
        console.log('Updated in Server: ',res);

        updatedLocally.then( (r) => {
          console.log('Updated Locally: ',res);
          resolve(res);
        })
        .catch( (error) => {
          console.log('Error Updating Locally: '+error);
          reject(error);
        })
      })
      .catch( (err) => {
        console.log('Error Updating in Server: '+err);
      })
    }).then( (result) => {
      //final result
      console.log('Updating in Server and Locally succesful.');
    }).catch( (errors) => {
      //final errors
      console.log(errors);
    });

    return promise;
  }


}
