import { Injectable } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { Cosplay } from '../cosplay.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CosplayGroupService {
    private _cosplaygroups = new BehaviorSubject<CosplayGroup[]>(
        [
            new CosplayGroup(
                'g1',
                'Grupal Kimetsu',
                'Kimetsu no Yaiba',
                'https://static.timesofisrael.com/www/uploads/2019/03/iStock-1060517676-e1553784733101.jpg',
                'Mallorca',
                new Date('2019-01-20'),
                new Date('2019-01-25'),
                'user1'
            )
        ]
    ) ;

    get cosplaygroups() {
        return this._cosplaygroups.asObservable();
    }

    constructor( private authService: AuthService ) {}

    getCosplayGroup(id: string) {
        return this.cosplaygroups.pipe(
            take(1),
            map(cosplaygroups => {
                return {...cosplaygroups.find(p => p.id === id)};
        })
    );
    }

    addCosplayGroup(title: string, series: string, imageUrl: string, dateFrom: Date, dateTo: Date, place: string) {
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
        this.cosplaygroups.pipe(take(1)).subscribe((cosplaygroups) => {
            this._cosplaygroups.next(cosplaygroups.concat(newCosplayGroup));
        }); // have a look at cosplayG subject, and subscribe, but take only 1 object and cancel subscrib

    }

}
