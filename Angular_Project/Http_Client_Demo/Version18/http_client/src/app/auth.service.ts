import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , tap } from 'rxjs';

interface LoginRequest {
  username :  string;
  password : string;
}
interface LoginResponse {
  token : string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/auth/login';
  
  constructor( private http : HttpClient) { }

  login() :  Observable<any> {
    return this.http.post(this.apiUrl ,{
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30
  });
  }
}
