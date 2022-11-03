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
  private usersCollection: AngularFirestoreCollection<User>;


  get users() {
    return this._users.asObservable();
  }

  constructor( private readonly afs: AngularFirestore ) {
    this.usersCollection = afs.collection<User>('users');
    this.getUsers();
    console.log("users: "+this.usersObsv);
  }


  getUsers(): void {
    this.usersObsv = this.usersCollection.snapshotChanges().pipe(
        map( actions => actions.map( a => a.payload.doc.data() as User))
    )
  }

  getUserById(userId: string) {
    return this.afs
    .collection('users')
    .doc(userId)
    .valueChanges()
  }

  onUpdateUserProfile( displayName, photoURL) : Promise<any>{
    const auth = getAuth();


    const promise = new Promise( (resolve, reject) => {
      updateProfile(auth.currentUser, {
        displayName, photoURL
      }).then(() => {
        
        resolve(true);
        // ...
      }).catch((error) => {
        
        reject(false);
        // An error occurred
        // ...
      });
    } );

    return promise;
  }

  onSaveUser(user: User, userId: string): Promise<void> {

    return new Promise( async (resolve, reject) => {
        try {
            const id = userId || this.afs.createId();
            const data = {id, ... user};
            const result = await this.usersCollection.doc(id).set(data);
            //then save the cosplay to localstorage
            //this.dataService.addData('cosplay',cosplay);
            resolve(result);
        } catch (err) {
            reject(err.message)
        }
    })
    
  }

}
