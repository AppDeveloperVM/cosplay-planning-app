import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Planning } from './planning.model';

interface PlanningData {
  title: string;
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

  constructor() { }


  uploadImage(image:File) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    
    return null;
  }

  addPlanning(
    title: string,
    imageUrl: string,
    places: any,
) {
    let generatedId: string;
    const newCosplayGroup = new CosplayGroup(
        Math.random().toString(),
        title,
        series,
        imageUrl,
        place,
        dateFrom,
        dateTo,
        this.authService.userId,
        location
    );
    return this.http
    .post<{title: string}>(
        'https://cosplay-planning-app.firebaseio.com/cosplay-groups.json',
        { ...newCosplayGroup, id: null}
    ).pipe(
        switchMap(resData => {
            generatedId = resData.title;
            return this.cosplaygroups;
        }),
        take(1),
        tap(cosplaygroups => {
            newCosplayGroup.id = generatedId;
            this._cosplaygroups.next(cosplaygroups.concat(newCosplayGroup));
        }));

}

}
