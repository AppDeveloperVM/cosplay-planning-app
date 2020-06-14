import { Injectable } from '@angular/core';
import { Cosplay } from './cosplay.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CosplaysService {
  private _cosplays = new BehaviorSubject<Cosplay[]>(
    [
      new Cosplay('c1', 'Samatoki', 'MTC rapper', 'https://pbs.twimg.com/media/DluGJLAUYAEdcIT?format=jpg&name=small', 'Hypmic', 0, '0', true,'user1'),
      new Cosplay('c2', 'Jyuuto', 'MTC rapper', 'https://pbs.twimg.com/media/DluGVivU0AA0U87?format=jpg&name=small', 'Hypmic', 0, '0', false, 'user1'),
      new Cosplay('c3', 'Riou', 'MTC rapper', 'https://pbs.twimg.com/media/DluGfijU8AA0XcX?format=jpg&name=small', 'Hypmic', 0, '0', false, 'user1')
      ]
  );

  private _cosplay_character_requested: Cosplay[] = [
  ];

  constructor(private authService: AuthService) { }

  get cosplays() {
    return this._cosplays.asObservable();
  }

  getCosplay(id: string) {
    return this.cosplays.pipe(
      take(1),
      map(cosplays => {
        return {...cosplays.find(c => c.id === id)};
    }))
  }

  addCosplay(characterName: string, description: string, imageUrl: string, series: string, funds: number, percentComplete: string, status: boolean ) {
    const newCosplay = new Cosplay(
      Math.random().toString(),
      characterName,
      description,
      'https://pbs.twimg.com/media/DluGJLAUYAEdcIT?format=jpg&name=small',
      series,
      funds,
      percentComplete,
      status,
      this.authService.userId
    );
    this.cosplays.pipe(take(1)).subscribe((cosplays)=> {
      this._cosplays.next(cosplays.concat(newCosplay));
    })
  }

  // Pero yo necesito un nuevo cosplay Group character request
  setCosplayGroupRequest(id: string, characterName: string, description: string, imageUrl: string, series: string, funds: number, percentComplete: string, status: boolean, userId: string) {
    const newCosplayRequest = new Cosplay(
        Math.random().toString(),
        characterName,
        description,
        'https://pbs.twimg.com/media/DluGJLAUYAEdcIT?format=jpg&name=small',
        series,
        funds,
        percentComplete,
        status,
        this.authService.userId
    );
  }

}
