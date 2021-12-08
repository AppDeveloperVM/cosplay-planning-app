import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //localStorage.setItem('auth_token',"user1");
    const token = localStorage.getItem('userId');

    const tokenizeReq = req.clone({
        setHeaders: {
          authorization: `${ token }`,
          contentType: 'application/json'
        },
        
        withCredentials: false
      });

    return next.handle(tokenizeReq).pipe(
      tap(
        event => {
            if(event instanceof HttpResponse){
                //api call success
                 console.log('success in calling API : ', event);
            }
        },
        error => {
            if (error.status === 401) {
                //api call error
                console.log('error in calling API ');
                this.router.navigateByUrl('/login');
            }
            return throwError( error );
        }
    ));

  }
}
