import { Injectable } from '@angular/core';

import { Cosplay }  from './cosplay.model';

@Injectable({
  providedIn: 'root'
})
export class CosplaysService {
  private _cosplays: Cosplay[] = [
  new Cosplay('c1', 'Samatoki', 'MTC rapper', 'https://pbs.twimg.com/media/DluGJLAUYAEdcIT?format=jpg&name=small', 'Hypmic', 0, '0', false),
  new Cosplay('c2', 'Jyuuto', 'MTC rapper', 'https://pbs.twimg.com/media/DluGVivU0AA0U87?format=jpg&name=small', 'Hypmic', 0, '0', false),
  new Cosplay('c3', 'Riou', 'MTC rapper', 'https://pbs.twimg.com/media/DluGfijU8AA0XcX?format=jpg&name=small', 'Hypmic', 0, '0', false)
  ];

  get cosplays() {
    return [...this._cosplays];
  }

  constructor() { }
}
