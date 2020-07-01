import { Injectable } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { Cosplay } from '../cosplay.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

    addCosplayGroup(
        title: string,
        series: string,
        imageUrl: string,
        place: string,
        dateFrom: Date,
        dateTo: Date
    ) {
        let generatedId: string;
        const newCosplayGroup = new CosplayGroup(
            Math.random().toString(),
            title,
            series,
            'https://static.timesofisrael.com/www/uploads/2019/03/iStock-1060517676-e1553784733101.jpg',
            place,
            dateFrom,
            dateTo,
            this.authService.userId
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
