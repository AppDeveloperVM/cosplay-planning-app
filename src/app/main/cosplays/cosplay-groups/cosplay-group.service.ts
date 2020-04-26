import { Injectable } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';

@Injectable({
    providedIn: 'root'
})
export class CosplayGroupService {
    private _cosplaygroups: CosplayGroup = [];

    get cosplaygroups() {
        return [...this._cosplaygroups];
    }

    constructor() {}
}