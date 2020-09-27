import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Planning } from './planning.model';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { PlaceLocation } from '../cosplays/cosplay-groups/location.model';

interface PlanningData {
  title: string;
  description: string;
  imageUrl: string;
  places: any;
  location: any;
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

  constructor(private authService: AuthService, private http: HttpClient) { }

  getPlanning(id: string) {
    return this.plannings
    .pipe(
      take(1),
      map(plannings => {
        return {...plannings.find(p => p.id === id)};
      })
    );
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
    location: any,
    places: any,
) {
    let generatedId: string;
    const newPlanning = new Planning(
        Math.random().toString(),
        title,
        description,
        imageUrl,
        location,
        places,
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
