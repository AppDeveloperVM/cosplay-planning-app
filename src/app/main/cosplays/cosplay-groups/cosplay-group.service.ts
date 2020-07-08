import { Injectable } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { Cosplay } from '../cosplay.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';

/*
new CosplayGroup(
    'g1',
    'Grupal Kimetsu',
    'Kimetsu no Yaiba',
    'https://static.timesofisrael.com/www/uploads/2019/03/iStock-1060517676-e1553784733101.jpg',
    'Mallorca',
    new Date('2019-01-20'),
    new Date('2019-01-25'),
    'user1'
),
new CosplayGroup(
    'g2',
    'Grupal Naruto',
    'Naruto',
    'https://static.timesofisrael.com/www/uploads/2019/03/iStock-1060517676-e1553784733101.jpg',
    'Sevilla',
    new Date('2019-01-20'),
    new Date('2019-01-25'),
    'user33'
)
*/

interface CosplayGroupData {
    availableFrom: Date;
    availableTo: Date;
    imageUrl: string;
    place: string;
    series: string;
    title: string;
    userId: string;
    location: PlaceLocation;
}

@Injectable({
    providedIn: 'root'
})
export class CosplayGroupService {
    private _cosplaygroups = new BehaviorSubject<CosplayGroup[]>(
        []
    ) ;

    get cosplaygroups() {
        return this._cosplaygroups.asObservable();
    }

    constructor( private authService: AuthService, private http: HttpClient ) {}

    getCosplayGroup(id: string) {
        return this.cosplaygroups.pipe(
            take(1),
            map(cosplaygroups => {
                return {...cosplaygroups.find(p => p.id === id)};
        })
    );
    }

    fetchCosplayGroups() {
        return this.http.get<{ [key: string]: CosplayGroupData}>(
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

}
