import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Planning } from './planning.model';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, tap } from 'rxjs/operators';

interface PlanningData {
  title: string;
  description: string;
  imageUrl: string;
  places: any;
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
    imageurl: string,
    places: any,
) {
    let generatedId: string;
    const newPlanning = new Planning(
        Math.random().toString(),
        title,
        description,
        imageurl,
        places,
        this.authService.userId
    );
    return this.http
    .post<{title: string}>(
        'https://cosplay-planning-app.firebaseio.com/cosplay-groups.json',
        { ...newPlanning, id: null}
    ).pipe(
        switchMap(resData => {
            generatedId = resData.title;
            return this.plannings;
        }),
        take(1),
        tap(cosplaygroups => {
            newPlanning.id = generatedId;
            this._plannings.next(cosplaygroups.concat(newPlanning));
        }));

}

}
