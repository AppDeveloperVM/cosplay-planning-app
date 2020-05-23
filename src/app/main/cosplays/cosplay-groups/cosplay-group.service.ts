import { Injectable } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';

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
            new Date('2019-01-20'),
            new Date('2019-01-25')
        )
    ];

    get cosplaygroups() {
        return [...this._cosplaygroups];
    }

    constructor() {}

    getCosplayGroup(id: string) {
        return {...this.cosplaygroups.find(p => p.id === id)};
    }
    /*setCosplayRequest(characterName: string) {
        this._cosplaygroups[] = new CosplayGroup('g1',
        'Grupal Kimetsu',
        'Kimetsu no Yaiba',
        new Date(2018, 11, 24, 10, 33, 30, 0),
        'https://static.timesofisrael.com/www/uploads/2019/03/iStock-1060517676-e1553784733101.jpg'
        );
    }
    */
}