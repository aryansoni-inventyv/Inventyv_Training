import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('authToken');

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Interceptor': 'DI-Based'
      }
    });
    console.log(' before ', req);
    console.log('Interceptor applied:', modifiedReq.headers);

    return next.handle(modifiedReq);
  }
}
