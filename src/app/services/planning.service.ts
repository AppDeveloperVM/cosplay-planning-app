import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Planning } from '../main/planning/planning.model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { PlaceLocation } from '../models/location.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { PlanningInterface } from '../models/planning.interface';

interface PlanningData {
  title: string;
  description: string;
  imageUrl: string;
  places: any;
  location: any;
  startsAt: Date,
  endsAt: Date,
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private _plannings = new BehaviorSubject<Planning[]>(
    []
  );

  get plannings() {
    return this._plannings.asObservable();
  }

    planningsObs: Observable<PlanningData[]>;
    private planningsCollection: AngularFirestoreCollection<PlanningData>;
    private cosgroupCollection: AngularFirestoreCollection<PlanningData>;


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private readonly afs: AngularFirestore
  ) {
    this.planningsCollection = afs.collection<PlanningData>('plannings');
    this.getPlannings();
  }

  private getPlannings() : void {
    this.planningsObs = this.planningsCollection.snapshotChanges().pipe(
      map( actions => actions.map( a => a.payload.doc.data() as PlanningData))
    )
  }


  getPlanningById(planningId: string) {
    return this.afs
    .collection('plannings')
    .doc(planningId)
    .valueChanges()
  }

  onSavePlanning(planning: PlanningInterface, planningId: string): Promise<void> {
    return new Promise( async (resolve, reject) => {
        try {
            const id = planningId || this.afs.createId();
            const data = {id, ...planning};
            const result = await this.planningsCollection.doc(id).set(data);
            resolve(result);
        } catch (err) {
            reject(err.message)
        }
    })
  }


  onDeletePlanning(planningId: string): Promise<void> {
     //should delete img of FireStorage
    /*
    db : AngularFireDatabase
    const storageRef = db.storage().ref();
    storageRef.child('photo/' + photoId).delete();
    */ 
    return new Promise (async (resolve, reject) => {
        try {
            const result = this.planningsCollection.doc(planningId).delete();
            resolve(result);
        } catch(err){
            reject(err.message)
        }
    })
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string, imagePath: string}>(
        'https://us-central1-cosplay-planning-app.cloudfunctions.net/storeImage',
        uploadData
    );
  }

  

}
