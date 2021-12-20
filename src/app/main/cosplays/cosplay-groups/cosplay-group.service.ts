import { Injectable } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { Cosplay } from '../cosplay.model';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';
import { stringify } from 'querystring';


interface CosplayGroupData {
    title: string;
    place: string;
    availableFrom: Date;
    availableTo: Date;
    imageUrl: string;
    series: string;
    userId: string;
    location: PlaceLocation;
}

@Injectable({
    providedIn: 'root'
})
export class CosplayGroupService {
    private _cosplaygroups = new BehaviorSubject<CosplayGroup[]>(
        []
    );

    get cosplaygroups() {
        return this._cosplaygroups.asObservable();
    }

    constructor( private authService: AuthService, private http: HttpClient ) {}

    getCosplayGroup(id: string) {
        return this.http.get<CosplayGroupData>(
            `https://cosplay-planning-app.firebaseio.com/cosplay-groups/${id}.json`
          ).pipe(
            map(cosplayGroupData => {
              return new CosplayGroup(
                  id,
                  cosplayGroupData.title,
                  cosplayGroupData.series,
                  cosplayGroupData.imageUrl,
                  cosplayGroupData.place,
                  cosplayGroupData.availableFrom,
                  cosplayGroupData.availableTo,
                  this.authService.userId,
                  cosplayGroupData.location
              );
            })
        );
    }

    fetchCosplayGroups(userId: String) {
        return this.http
        .get<{ [key: string]: CosplayGroupData}>(
            `https://cosplay-planning-app.firebaseio.com/cosplay-groups.json?orderBy="userId"&equalTo="${
            this.authService.userId
            }"`
        )
        .pipe(
            map(CosplayGroupData => {
                const cosplayGroups = [];
                for (const key in CosplayGroupData) {
                    if (CosplayGroupData.hasOwnProperty(key)) {
                        cosplayGroups.push(new CosplayGroup(
                            key,
                            CosplayGroupData[key].title,
                            CosplayGroupData[key].series,
                            CosplayGroupData[key].imageUrl,
                            CosplayGroupData[key].place,
                            new Date(CosplayGroupData[key].availableFrom),
                            new Date(CosplayGroupData[key].availableTo),
                            CosplayGroupData[key].userId,
                            CosplayGroupData[key].location
                            )
                        );
                    }
                }
                return cosplayGroups;
            }), tap(cosplaygroups => {
                this._cosplaygroups.next(cosplaygroups);
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

    addCosplayGroup(
        title: string,
        series: string,
        imageUrl: string,
        place: string,
        dateFrom: Date,
        dateTo: Date,
        location: PlaceLocation,
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

    updateCosplayGroup(
        cosplayGroupId: string,
        title: string,
        series: string,
        imageUrl: string,
        place: string,
        availableFrom: Date,
        availableTo: Date,
        userId: string,
        location: PlaceLocation
    ) {
        let updatedCosplayGroups: CosplayGroup[];
        return this.cosplaygroups.pipe(
        take(1),
        switchMap( cosplays => {
            if (!cosplays || cosplays.length <= 0) {
            return this.fetchCosplayGroups(userId);
            } else {
            return of(cosplays);
            }

        }),
        switchMap(cosplaygroups => {
            const updatedCosplayGroupIndex = cosplaygroups.findIndex(cos => cos.id === cosplayGroupId);
            updatedCosplayGroups = [...cosplaygroups];
            const oldCosplay = updatedCosplayGroups[updatedCosplayGroupIndex];

            updatedCosplayGroups[updatedCosplayGroupIndex] = new CosplayGroup(
            oldCosplay.id,
            title,
            series,
            imageUrl,
            place,
            availableFrom,
            availableTo,
            userId,
            location
            );
            return this.http.put(
            `https://cosplay-planning-app.firebaseio.com/cosplay-groups/${cosplayGroupId}.json`,
            { ...updatedCosplayGroups[updatedCosplayGroupIndex], id: null}
            );
        })
        , tap(cosplaygroups  => {
            this._cosplaygroups.next(updatedCosplayGroups);
        }));

    }


}
