import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {

  getToken(): string {
    return 'FAKE_JWT_TOKEN_DI';
  }
}
