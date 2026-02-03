import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(
    req : HttpRequest<any>,
    next : HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = 'fake_token';

    const modifiedRequest =  req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Original Request:', req);
    console.log('Intercepted Request:', modifiedRequest);

    return next.handle(modifiedRequest);
  }
}
