import { Injectable } from '@angular/core';
import { Cosplay } from '../../cosplay.model';
import { BehaviorSubject } from 'rxjs';
import { CosplayGroup } from '../cosplay-group.model';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CosplayGroupRequestService {
  // private _cosplaygrouprequest = new BehaviorSubject<Cosplay[]>([]);
  private _cosplaygrouprequest: Cosplay[];

  get cosplaygrouprequests() {
    // return this._cosplaygrouprequest.asObservable();
    return this._cosplaygrouprequest;
  }

  constructor(private authService: AuthService) {}

  addCosplayGroupRequest(
    cosplayId: string,
    cosplayCharacter: string,
    cosplayImg: string,
    UserRequestingName: string
  ) {
    const newCosplayGroupRequest = new Cosplay(
      Math.random().toString(),
      cosplayCharacter,
      cosplayImg,
      UserRequestingName,
      '',
      0,
      '',
      true,
      this.authService.userId
    );
  }

  cancelCosplayGroupRequest(cosplayGroupId) {

  }

}

