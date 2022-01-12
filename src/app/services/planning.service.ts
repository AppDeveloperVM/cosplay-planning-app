import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Planning } from '../main/planning/planning.model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { PlaceLocation } from '../main/cosplays/cosplay-groups/location.model';
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
    console.log("Plannings: "+ this.planningsObs);
  }

  private getPlannings() : void {
    this.planningsObs = this.planningsCollection.snapshotChanges().pipe(
      map( actions => actions.map( a => a.payload.doc.data() as PlanningData))
    )
  }

  getPlanning(id: string) {

    return this.http.get<PlanningData>(
      `https://cosplay-planning-app.firebaseio.com/plannings/${id}.json`
    ).pipe(
      map(planningData => {
        return new Planning(
            id,
            planningData.title,
            planningData.description,
            planningData.imageUrl,
            planningData.places,
            planningData.location,
            planningData.startsAt,
            planningData.endsAt,
            this.authService.userId
        );
      })

  );
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


  fetchPlannings() {
    return this.http
    .get<{[key: string]: PlanningData}>(
      `https://cosplay-planning-app.firebaseio.com/plannings.json?orderBy="userId"&equalTo="${
            this.authService.userId
            }"`
      )
    .pipe(
      map(resData => {
        const plannings = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            plannings.push(new Planning(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].location,
              resData[key].places,
              resData[key].startsAt,
              resData[key].endsAt,
              resData[key].userId
              ));
          }
        }
        return plannings;
    }),
    tap(plannings => {
      this._plannings.next(plannings);
    })
    );
  }



  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string, imagePath: string}>(
        'https://us-central1-cosplay-planning-app.cloudfunctions.net/storeImage',
        uploadData
    );
  }

  addPlanning(
    title: string,
    description: string,
    imageUrl: string,
    location: any,// Main City ( coords autocompleted by searchBox )
    places: any, //Multiple Markers
    startsAt: Date,
    endsAt: Date,
    userId: string,
) {
    let generatedId: string;
    const newPlanning = new Planning(
        Math.random().toString(),
        title,
        description,
        imageUrl,
        location,
        places,
        startsAt,
        endsAt,
        this.authService.userId
    );
    return this.http
    .post<{title: string}>(
        'https://cosplay-planning-app.firebaseio.com/plannings.json',
        { ...newPlanning, id: null}
    ).pipe(
        switchMap(resData => {
            generatedId = resData.title;
            return this.plannings;
        }),
        take(1),
        tap(plannings => {
            newPlanning.id = generatedId;
            this._plannings.next(plannings.concat(newPlanning));
        }));

    }

  updatePlanning(
      planningId: string,
      title: string,
      description: string,
      imageUrl: string,
      location: PlaceLocation,
      places: any,
      startsAt: Date,
      endsAt: Date,
      userId: string,
  ) {

      let updatedPlannings: Planning[];
      return this.plannings.pipe(
      take(1),
      switchMap( plannings => {
          if (!plannings || plannings.length <= 0) {
          return this.fetchPlannings();
          } else {
          return of(plannings);
          }

      }),
      switchMap(plannings => {
          const updatedPlanningIndex = plannings.findIndex(cos => cos.id === planningId);
          updatedPlannings = [...plannings];
          const oldPlanning = updatedPlannings[updatedPlanningIndex];

          updatedPlannings[updatedPlanningIndex] = new Planning(
            oldPlanning.id,
            title,
            description,
            imageUrl,
            location,
            places,
            startsAt,
            endsAt,
            userId
          );
          return this.http.put(
          `https://cosplay-planning-app.firebaseio.com/plannings/${planningId}.json`,
          { ...updatedPlannings[updatedPlanningIndex], id: null}
          );
      })
      , tap(plannings => {
          this._plannings.next(updatedPlannings);
      }));

  }

}
