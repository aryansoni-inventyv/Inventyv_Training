import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '../service/logger';
import { TokenService } from '../token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private tokenService :  TokenService){}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    if(token){
      const authreq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });

      console.log('token attahced to request');
      return next.handle(authreq);
    }

    return next.handle(req);
  }
}