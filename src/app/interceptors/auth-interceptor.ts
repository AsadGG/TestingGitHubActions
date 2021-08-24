import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';

import { EMPTY, empty, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { ApiPaths } from 'environments/api-paths';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private _http: HttpClient,
        private _router: Router,
        private _spinner: NgxSpinnerService
) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
        request = this.attachHeaders(request);

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse)=> {
                console.log(error)
                if (error.status === 401 && error.error.message === "jwt expired") {
                  
                    // refresh access token
                    return this.refreshToken().pipe(
                        switchMap(() => {
                            request = this.attachHeaders(request);
                            return next.handle(request);
                        }),
                        catchError((error: any) => {
                            console.log(error);
                            // redirect to logout
                            localStorage.clear();
                            this._spinner.hide();
                            this._router.navigate(['/login']);
                            return EMPTY;
                        })
                    )
                } else if (error.status === 403) {
                    localStorage.clear();
                    this._router.navigate(['/login']);
                }
                this._spinner.hide();
                return throwError(error);
            }),
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                console.log('event--->>>', event);
                }
                return event;
            }),
        );
    }
    
    refreshToken() {
        let refreshToken: string | null = localStorage.getItem('refresh_token');
        return this._http.post(ApiPaths.getRefreshToken, { refreshToken: refreshToken }).pipe(
            tap((res: HttpResponse<any>) => {
                localStorage.setItem("access_token", res.body.tokens.accessToken);
                localStorage.setItem("refresh_token", res.body.tokens.refreshToken);
                console.log("Access Token Refreshed");
            })
        );
    }

    attachHeaders(request: HttpRequest<any>): HttpRequest<any> {
        const token: string | null = localStorage.getItem('access_token');

        if (token) {
          request = request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + token),
          });
        }
    
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json'),
          });
        }
    
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json'),
        });
        // request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });

        return request.clone(request);
    }


}
