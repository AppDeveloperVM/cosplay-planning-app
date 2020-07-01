import { Injectable } from '@angular/core';
import { Cosplay } from './cosplay.model';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


/*
new Cosplay('c1', 'Samatoki', 'MTC rapper', 'https://pbs.twimg.com/media/DluGJLAUYAEdcIT?format=jpg&name=small', 'Hypmic', 0, '0', true,'user1'),
new Cosplay('c2', 'Jyuuto', 'MTC rapper', 'https://pbs.twimg.com/media/DluGVivU0AA0U87?format=jpg&name=small', 'Hypmic', 0, '0', false, 'user1'),
new Cosplay('c3', 'Riou', 'MTC rapper', 'https://pbs.twimg.com/media/DluGfijU8AA0XcX?format=jpg&name=small', 'Hypmic', 0, '0', false, 'user1')
*/

interface CosplayData {
  characterName: string;
  description: string;
  imageUrl: string;
  series: string;
  funds: number;
  percentComplete: string;
  status: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CosplaysService {
  private _cosplays = new BehaviorSubject<Cosplay[]>([]);

  private _cosplay_character_requested: Cosplay[] = [
  ];

  get cosplays() {
    return this._cosplays.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchCosplays() {
    return this.http
    .get<{[key: string]: CosplayData}>(
      'https://cosplay-planning-app.firebaseio.com/my-cosplays.json'
      )
    .pipe(map(resData => {
      const cosplays = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          cosplays.push(new Cosplay(
            key,
            resData[key].characterName,
            resData[key].description,
            resData[key].imageUrl,
            resData[key].series,
            resData[key].funds,
            resData[key].percentComplete,
            resData[key].status,
            resData[key].userId));
        }
      }
      return cosplays;
    }),
    tap(cosplays => {
      this._cosplays.next(cosplays);
    })
    );
  }

  getCosplay(id: string) {
    return this.http.get<CosplayData>(
      `https://cosplay-planning-app.firebaseio.com/my-cosplays/${id}.json`
    ).pipe(
      map(cosplayData => {
        return new Cosplay(
          id,
          cosplayData.characterName,
          cosplayData.description,
          cosplayData.imageUrl,
          cosplayData.series,
          cosplayData.funds,
          cosplayData.percentComplete,
          cosplayData.status,
          cosplayData.userId
          );
      })
    );
  }

  getCosplayById(cosplayId: string) {
    return this.cosplays.pipe(take(1), map(cosplays => {
      return cosplays.find((cos) => {
        return cos.id === cosplayId;
      });
    }));
  }

  addCosplay(
    characterName: string,
    description: string,
    imageUrl: string,
    series: string,
    funds: number,
    percentComplete: string,
    status: boolean
  ) {
    let generatedId: string;
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

    return this.http
    .post<{name: string}>('https://cosplay-planning-app.firebaseio.com/my-cosplays.json', { ...newCosplay, id: null})
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.cosplays;
      }),
      take(1),
      tap(cosplays => {
        newCosplay.id = generatedId;
        this._cosplays.next(cosplays.concat(newCosplay));
      })
    );
    /*return this.cosplays.pipe(take(1)).subscribe((cosplays) => {
      this._cosplays.next(cosplays.concat(newCosplay));
    });**/
  }

  // Pero yo necesito un nuevo cosplay Group character request
  setCosplayGroupRequest(
    id: string,
    characterName: string,
    description: string,
    imageUrl: string,
    series: string,
    funds: number,
    percentComplete: string,
    status: boolean,
    userId: string
  ) {
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

  updateCosplay(
    cosplayId: string,
    characterName: string,
    description: string,
    imageUrl: string,
    series: string,
    funds: number,
    percentComplete: string,
    status: boolean,
    userId: string
  ) {
    let updatedCosplays: Cosplay[];
    return this.cosplays.pipe(
      take(1),
      switchMap( cosplays => {
        if (!cosplays || cosplays.length <= 0) {
          return this.fetchCosplays();
        } else {
          return of(cosplays);
        }

      }),
      switchMap(cosplays => {
        const updatedCosplayIndex = cosplays.findIndex(cos => cos.id === cosplayId);
        updatedCosplays = [...cosplays];
        const oldCosplay = updatedCosplays[updatedCosplayIndex];

        updatedCosplays[updatedCosplayIndex] = new Cosplay(
          oldCosplay.id,
          characterName,
          description,
          imageUrl,
          series,
          oldCosplay.funds,
          oldCosplay.percentComplete,
          oldCosplay.status,
          oldCosplay.userId
        );
        return this.http.put(
          `https://cosplay-planning-app.firebaseio.com/my-cosplays/${cosplayId}.json`,
          { ...updatedCosplays[updatedCosplayIndex], id: null}
        );
      })
      , tap(cosplays  => {
        this._cosplays.next(updatedCosplays);
      }));
  }

}
