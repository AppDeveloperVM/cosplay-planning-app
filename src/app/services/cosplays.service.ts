import { Injectable } from '@angular/core';
import { Cosplay } from '../models/cosplay.model';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';

//Firebase 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { StorageService } from './storage.service';

/*
new Cosplay('c1', 'Samatoki', 'MTC rapper', 'https://pbs.twimg.com/media/DluGJLAUYAEdcIT?format=jpg&name=small', 'Hypmic', 0, '0', true,'user1'),
new Cosplay('c2', 'Jyuuto', 'MTC rapper', 'https://pbs.twimg.com/media/DluGVivU0AA0U87?format=jpg&name=small', 'Hypmic', 0, '0', false, 'user1'),
new Cosplay('c3', 'Riou', 'MTC rapper', 'https://pbs.twimg.com/media/DluGfijU8AA0XcX?format=jpg&name=small', 'Hypmic', 0, '0', false, 'user1')
*/

interface CosplayData {
  characterName: string;
  description: string;
  imageUrl: string;
  series: string;
  funds: number;
  percentComplete: string;
  status: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CosplaysService {
  private _cosplays = new BehaviorSubject<Cosplay[]>([]);
  private _cosplay_character_requested: Cosplay[] = [
  ];

  get cosplays() {
    return this._cosplays.asObservable();
  }

  //Collections
  cosplaysObsv: Observable<Cosplay[]>;
  private cosplaysCollection: AngularFirestoreCollection<Cosplay>;


  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private http: HttpClient,
    private readonly afs: AngularFirestore,
    private storage : AngularFireStorage,
    public storageService : StorageService
  ) {
      this.cosplaysCollection = afs.collection<Cosplay>('cosplays');
      this.getCosplays();
      console.log("cosplays: "+this.cosplaysObsv);
  }

  getCosplays(): void {
    this.cosplaysObsv = this.cosplaysCollection.snapshotChanges()
    .pipe(
        map( actions => actions.map( a => a.payload.doc.data() as Cosplay)),
        take(1)
    )
  }

  getCosplayById(cosplayId: string) {
    return this.afs
    .collection('cosplays')
    .doc(cosplayId)
    .valueChanges()
  }

  onSaveCosplay(cosplay: Cosplay, cosplayId: string): Promise<void> {
    return new Promise( async (resolve, reject) => {
        try {
            const id = cosplayId || this.afs.createId();
            const data = {id, ... cosplay};
            const result = await this.cosplaysCollection.doc(id).set(data);
            //then save the cosplay to localstorage
            //this.dataService.addData('cosplay',cosplay);
            resolve(result);
        } catch (err) {
            reject(err.message)
        }
    })
    
  }


  //deleteCosGallery(){ }

  onDeleteCosplay(cosplayId: string): Promise<void> {
    //should delete img of FireStorage
    /*
    db : AngularFireDatabase
    const storageRef = db.storage().ref();
    storageRef.child('photo/' + photoId).delete();
    */ 

    

    return new Promise (async (resolve, reject) => {
        try {
            const result = this.cosplaysCollection.doc(cosplayId).delete();
            resolve(result);
        } catch(err){
            reject(err.message)
        }
    })
  }


}
