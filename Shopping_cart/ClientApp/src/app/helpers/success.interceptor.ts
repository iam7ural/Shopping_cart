import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



      const cachedResponse = this.cache.get(request.url);
      if (cachedResponse) {
        return of(cachedResponse);
      }

      return next.handle(request).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.cache.set(request.url, event);
          }
        })
      );
    }



}
