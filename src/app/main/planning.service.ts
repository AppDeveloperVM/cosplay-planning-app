import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Planning } from './planning/planning.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface PlanningData {
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private _plannings = new BehaviorSubject<Planning[]>(
    []
  );

  get plannings() {
    return this._plannings.asObservable();
  }

  constructor( private authService: AuthService, private http: HttpClient) { }

  addPlanning(
    title: string,
    description: string,
    places: any
  ) {
    let generatedId: string;
    const newPlanning = new Planning(
      Math.random().toString(),
      title,
      description,
      places,
      this.authService.userId
    );

    /*return this.http
    .post*/
    return;
  }


}
