import { Injectable } from '@angular/core';
import { Cosplay } from '../main/cosplays/cosplay.model';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
//Firebase 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';

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
  cosplaysObsv: Observable<CosplayData[]>;
  private cosplaysCollection: AngularFirestoreCollection<CosplayData>;


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private readonly afs: AngularFirestore

  ) {
      this.cosplaysCollection = afs.collection<CosplayData>('cosplays');
      this.getCosplays();
      console.log("cosplays: "+this.cosplaysObsv);
  }

  private getCosplays(): void {
    this.cosplaysObsv = this.cosplaysCollection.snapshotChanges().pipe(
        map( actions => actions.map( a => a.payload.doc.data() as CosplayData))
    )
  }

  onSaveCosplay(cosplay: CosplayData, cosplayId: string): Promise<void> {
    return new Promise( async (resolve, reject) => {
        try {
            const id = cosplayId || this.afs.createId();
            const data = {id, ... cosplay};
            const result = await this.cosplaysCollection.doc(id).set(data);
            resolve(result);
        } catch (err) {
            reject(err.message)
        }
    })
  }

  

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


  getCosplayById(cosplayId: string) {
    return this.cosplays.pipe(take(1), map(cosplays => {
      return cosplays.find((cos) => {
        return cos.id === cosplayId;
      });
    }));
  }


}
