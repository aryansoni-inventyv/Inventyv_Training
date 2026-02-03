import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/auth';

  constructor(
    private http : HttpClient,
    private tokenService :  TokenService
  ){}

  login() :  Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`,{
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30
    }).pipe(
      tap(
        response => {
          this.tokenService.setToken(response.accessToken);
        }
      )
    );
  }


  getCurrentUser() :  Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
  
}