import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , tap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/auth/login';
  constructor( private http : HttpClient) { }

  login() :  Observable<any> {
    const body = {
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30
    };  

    return this.http.post(this.apiUrl ,body ); 
  }


}
