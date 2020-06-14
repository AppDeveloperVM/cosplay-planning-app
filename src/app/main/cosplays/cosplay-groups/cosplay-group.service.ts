import { Injectable } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { Cosplay } from '../cosplay.model';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CosplayGroupService {
    private _cosplaygroups: CosplayGroup[] = [
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
    ];

    get cosplaygroups() {
        return [...this._cosplaygroups];
    }

    constructor( private authService: AuthService ) {}

    getCosplayGroup(id: string) {
        return {...this.cosplaygroups.find(p => p.id === id)};
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
        this._cosplaygroups.push(newCosplayGroup);
    }

}
